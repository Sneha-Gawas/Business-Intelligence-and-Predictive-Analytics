import dash
import dash_bootstrap_components as dbc
from dash import dcc, html
import plotly.express as px
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import fpgrowth, association_rules
import dash_cytoscape as cyto
from prophet import Prophet
import numpy as np
import plotly.graph_objects as go
from dash.dependencies import Input, Output
from dash import dcc

def load_collection_to_df(collection):
    data = list(collection.find({}, {"_id": 0}))
    df = pd.DataFrame(data)
    if df.empty:
        return df

    df['date'] = pd.to_datetime(df.get('date', pd.Series([])), format='%d-%m-%Y', errors='coerce')
    if 'Quantity' not in df.columns:
        df['Quantity'] = 1
    df['Revenue'] = pd.to_numeric(df.get('TotalCost', 0), errors='coerce').fillna(0)
    return df


def init_dashboard(server, collection):
    dash_app = dash.Dash(
        __name__,
        server=server,
        url_base_pathname='/dash/',
        external_stylesheets=[dbc.themes.BOOTSTRAP]
    )

    # -------------------- Load Dataset -------------------- #
    df = load_collection_to_df(collection)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Quantity'] = df.get('Quantity', 1)
    df['Revenue'] = pd.to_numeric(df.get('Revenue', 0), errors='coerce').fillna(0)

    # -------------------- Top Products -------------------- #
    top_products = df.groupby("Items")["Quantity"].sum().reset_index()
    top_products = top_products[top_products["Items"].str.lower() != "salad"]
    top_products = top_products.sort_values(by="Quantity", ascending=False).head(10)
    fig_top_products = px.bar(
        top_products,
        x="Quantity",
        y="Items",
        orientation="h",
        template='plotly_dark',
        labels={"Quantity": "Total Sold", "Items": "Product"},
        text_auto=True
    )
    fig_top_products.update_layout(yaxis=dict(categoryorder="total ascending"))

    # -------------------- Weekly Revenue -------------------- #
    weekly_revenue = df.resample("W", on="date")["Revenue"].sum().reset_index()
    fig_weekly_revenue = px.line(
        weekly_revenue,
        x="date",
        y="Revenue",
        template='plotly_dark',
        markers=True,
        labels={"date": "Week", "Revenue": "Total Revenue (₹)"},
    )
    #fig_weekly_revenue.update_xaxes(range=[weekly_revenue['date'].min(), df['date'].max()])
    # -------------------- Payment Method Distribution -------------------- #
    payment_counts = df["paymentMethod"].value_counts().reset_index()
    payment_counts.columns = ["paymentMethod", "Count"]
    fig_payment = px.pie(
        payment_counts,
        names="paymentMethod",
        values="Count",
        hole=0.4,
        template='plotly_dark',
        color_discrete_sequence=px.colors.qualitative.Set3
    )

    # -------------------- Customer Segmentation -------------------- #
    customer_df = df.groupby('UserID').agg(
        total_spent=('Revenue', 'sum'),
        transactions=('TransactionID', 'count')
    ).reset_index()
    customer_df['avg_spent'] = customer_df['total_spent'] / customer_df['transactions']

    scaler = StandardScaler()
    features = scaler.fit_transform(customer_df[['total_spent', 'transactions', 'avg_spent']])
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    customer_df['Cluster'] = kmeans.fit_predict(features)
    cluster_labels = {0: 'Low Value', 1: 'Medium Value', 2: 'High Value'}
    customer_df['Cluster Label'] = customer_df['Cluster'].map(cluster_labels)

    cluster_counts = customer_df['Cluster Label'].value_counts().reset_index()
    cluster_counts.columns = ['Cluster Label', 'count']  # Ensure correct column names

    fig_customer_segments = px.pie(
        cluster_counts,
        names='Cluster Label',  # Use the correct column name
        values='count',
        title='Customer Segmentation',
        template='plotly_dark'
    )

    fig_customer_scatter = px.scatter(
        customer_df,
        x='transactions',
        y='total_spent',
        color='Cluster Label',
        hover_data=['UserID', 'avg_spent'],
        template='plotly_dark',
        title='Customer Segmentation: Spend vs Transactions'
    )

    

    # -------------------- Revenue Forecast -------------------- #
    forecast_df = df.groupby("date")["Revenue"].sum().reset_index()
    forecast_df.rename(columns={"date": "ds", "Revenue": "y"}, inplace=True)

# Train Prophet model
    model = Prophet()
    model.fit(forecast_df)

# Forecast 7 days (1 week ahead)
    future = model.make_future_dataframe(periods=7, freq="D")
    forecast = model.predict(future)

# Extract weekday names
    forecast["weekday"] = pd.to_datetime(forecast["ds"]).dt.day_name()

# Keep only next 7 days forecast
    forecast_week = forecast.tail(7)

# Line chart with weekdays on x-axis
    fig_forecast_weekdays = px.line(
    forecast_week,
    x="weekday",
    y="yhat",
    title="Revenue Forecast by Weekday",
    template="plotly_dark"
)

# Force weekday order (Mon → Sun)
    fig_forecast_weekdays.update_xaxes(
    categoryorder="array",
    categoryarray=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    title="Day of Week"
)



    # -------------------- Layout -------------------- #
    dash_app.layout = dbc.Container([
        
        # Replace the NavbarSimple block with:
dbc.Navbar(
    dbc.Container(
        dbc.Row([
            dbc.Col(html.Div(), width=4),  # empty left column
            dbc.Col(
                html.A(html.B("CAFE ANALYTICS DASHBOARD"), href="/dash/", style={"color":"white", "textDecoration":"none","fontSize":"25px"}),
                width=4, className="d-flex justify-content-center align-items-center"
            ),
            dbc.Col(
                dbc.Button("Back", color="secondary", href="http://localhost:5173/welcome?loggedIn=true"),
                width=4, className="d-flex justify-content-end align-items-center pe-0"
            ),
        ], className="w-100"),
        fluid=True
    ),
    color="primary",
    dark=True,
    className="mb-4",
),
        dbc.Row([
            dbc.Col(dbc.Card([dbc.CardBody([html.H4("Total Revenue", className="card-title"),
                                            html.H2(f"₹{df['Revenue'].sum():,.2f}", className="text-success")], className="text-center")], className="bg-white shadow-sm rounded p-3", style={"borderLeft":"4px solid #0d6efd"}), width=4),
            dbc.Col(dbc.Card([dbc.CardBody([html.H4("Average Transaction", className="card-title"),
                                            html.H2(f"₹{df['Revenue'].mean():,.2f}", className="text-primary")], className="text-center")], className="bg-white shadow-sm rounded p-3", style={"borderLeft":"4px solid #0d6efd"}), width=4),
            dbc.Col(dbc.Card([dbc.CardBody([html.H4("Total Transactions", className="card-title"),
                                            html.H2(f"{len(df):,}", className="text-warning")], className="text-center")], className="bg-white shadow-sm rounded p-3", style={"borderLeft":"4px solid #0d6efd"}), width=4)
        ], className="mb-4"),

        dbc.Row([html.H4("Top 10 Most Sold Products"), dbc.Col(dcc.Graph(figure=fig_top_products), width=12)]),
        dbc.Row([html.H4("Weekly Revenue Growth (over 12 months)"), dbc.Col(dcc.Graph(figure=fig_weekly_revenue), width=12)]),
        dbc.Row([html.H4("Payment Method Distribution"), dbc.Col(dcc.Graph(figure=fig_payment), width=12)]),
        dbc.Row([html.H4("Customer Segmentation"),
                 dbc.Col(dcc.Graph(figure=fig_customer_segments), width=6),
                 dbc.Col(dcc.Graph(figure=fig_customer_scatter), width=6)]),
        
        dbc.Row([
    html.H4("Weekly Revenue Forecast (by Weekday)"),
    dbc.Col(dcc.Graph(figure=fig_forecast_weekdays), width=12)
]),
         
# dbc.Row([html.H3("Product Revenue Contribution"), dbc.Col(dcc.Graph(figure=fig_cum_revenue), width=12)]),
      #  dbc.Row([html.H3("Correlation Matrix"), dbc.Col(dcc.Graph(figure=fig_corr), width=12)]),
    ], fluid=True)

    return dash_app.server