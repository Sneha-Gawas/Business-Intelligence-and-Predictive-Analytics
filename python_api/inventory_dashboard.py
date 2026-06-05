import dash
import dash_bootstrap_components as dbc
from dash import dcc, html
import pandas as pd
import numpy as np
from dash import Dash, dcc, html
import plotly.graph_objs as go
import plotly.express as px
from statsmodels.tsa.seasonal import seasonal_decompose
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
import datetime

def load_collection_to_df(collection):
    data = list(collection.find({}, {"_id": 0}))
    df = pd.DataFrame(data)
    if df.empty:
        return df
    df['date'] = pd.to_datetime(df.get('date', pd.Series([])), errors='coerce')
    df['quantity_sold'] = pd.to_numeric(df.get('quantity_sold', 0), errors='coerce')
    df['observed_market_price'] = pd.to_numeric(df.get('observed_market_price', 0), errors='coerce')
    return df

def init_dashboard(server, collection):
    dash_app = dash.Dash(
        __name__,
        server=server,
        url_base_pathname='/inventory/',
        external_stylesheets=[dbc.themes.BOOTSTRAP]
    )
    df = load_collection_to_df(collection)
    dash_app.layout = build_inventory_layout(df)
    return dash_app.server


def build_inventory_layout(df):
    # ===============================
    # LOAD DATA
    # ===============================
    # df is already loaded from collection

    df['date'] = pd.to_datetime(df['date'])
    df['quantity_sold'] = pd.to_numeric(df['quantity_sold'], errors='coerce')
    df['observed_market_price'] = pd.to_numeric(df['observed_market_price'], errors='coerce')

    df = df.dropna().sort_values('date')
    if 'weather' not in df.columns:
        df['weather'] = 'Sunny'
    if 'festival' not in df.columns:
        df['festival'] = 'No'

    df['month'] = df['date'].dt.month
    df['day'] = df['date'].dt.day
    df['weekday'] = df['date'].dt.dayofweek
    df['week'] = df['date'].dt.isocalendar().week
    df['lag_1'] = df['quantity_sold'].shift(1)
    df['lag_7'] = df['quantity_sold'].shift(7)
    df['rolling_mean_7'] = df['quantity_sold'].rolling(7).mean()

    df_encoded = pd.get_dummies(df, columns=['weather', 'festival'], drop_first=True)
    features = ['month', 'day', 'weekday', 'week', 'lag_1', 'lag_7', 'rolling_mean_7', 'observed_market_price'] + [col for col in df_encoded.columns if 'weather_' in col or 'festival_' in col]
    X = df_encoded[features]
    y = df_encoded['quantity_sold']

    X = X.apply(pd.to_numeric, errors='coerce').fillna(0)
    X_train, X_test, y_train, y_test = train_test_split(X, y, shuffle=False, test_size=0.2)

    model = GradientBoostingRegressor(n_estimators=300, max_depth=5)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    # ===============================
    # METRICS
    # ===============================
    mae = mean_absolute_error(y_test, y_pred)
    rmse = mean_squared_error(y_test, y_pred, squared=False)
    r2 = r2_score(y_test, y_pred)

    forecast_accuracy = {
        'MAE': mae,
        'RMSE': rmse,
        'R² Score': r2
    }

    # ===============================
    # FUTURE FORECAST
    # ===============================
    future_dates = pd.date_range(start=df['date'].max() + pd.Timedelta(days=1), periods=30)

    future_df = pd.DataFrame({'date': future_dates})
    future_df['month'] = future_df['date'].dt.month
    future_df['day'] = future_df['date'].dt.day
    future_df['weekday'] = future_df['date'].dt.dayofweek
    future_df['week'] = future_df['date'].dt.isocalendar().week

    future_df['weather'] = df['weather'].mode()[0]
    future_df['festival'] = df['festival'].mode()[0]
    future_df['lag_1'] = df['quantity_sold'].iloc[-1]
    future_df['lag_7'] = df['quantity_sold'].iloc[-7]

    future_df['rolling_mean_7'] = df['quantity_sold'].tail(7).mean()
    future_encoded = pd.get_dummies(future_df, columns=['weather','festival'], drop_first=True)

    future_encoded = pd.get_dummies(future_df, columns=['weather', 'festival'], drop_first=True)
    for col in X.columns:
        if col not in future_encoded:
            future_encoded[col] = 0
    future_encoded = future_encoded[X.columns]
    future_preds = model.predict(future_encoded)
    future_preds = np.round(future_preds).astype(int)
    future_preds = np.clip(future_preds, 0, None)

    impact_analysis = df.groupby(['weather', 'festival']).agg({
        'quantity_sold': 'mean',
        'observed_market_price': 'mean'
    }).reset_index()
    impact_analysis['impact_factor'] = impact_analysis['quantity_sold'] / df['quantity_sold'].mean()
    impact_analysis['condition'] = impact_analysis['weather'] + ' + ' + impact_analysis['festival'].astype(str)

    ts_df = df.set_index('date').resample('D')['quantity_sold'].sum().fillna(0)
    decomposition = seasonal_decompose(ts_df, model='additive', period=30)
    fig_decomposition = go.Figure()
    fig_decomposition.add_trace(go.Scatter(x=ts_df.index, y=decomposition.observed, mode='lines', name='Observed', line=dict(color='blue')))
    fig_decomposition.add_trace(go.Scatter(x=ts_df.index, y=decomposition.trend, mode='lines', name='Trend', line=dict(color='green')))
    fig_decomposition.update_layout(
        title='Time Series Decomposition (Observed & Trend)',
        template='plotly_dark',
        xaxis_title='Date',
        yaxis_title='Quantity Sold'
    )

    layout = dbc.Container([
        dbc.Navbar(
            dbc.Container(
                dbc.Row([
                    dbc.Col(html.Div(), width=4),
                    dbc.Col(
                        html.A(html.B("CAFE INVENTORY DASHBOARD"), href="/inventory/", style={"color": "white", "textDecoration": "none", "fontSize": "25px"}),
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

        dbc.Row([html.H4("Time Series Decomposition"),
                 dbc.Col(dcc.Graph(figure=fig_decomposition), width=12)]),

        dbc.Row([html.H4("Future Demand Forecast"),
                 dbc.Col(dcc.Graph(
                     figure=go.Figure([
                         go.Scatter(x=future_dates, y=future_preds, mode='lines+markers', name='Forecast')
                     ]).update_layout(template='plotly_dark')
                 ), width=12)]),

        dbc.Row([html.H4("Combined Weather + Festival Impact Analysis"),
            dbc.Col(dcc.Graph(
                figure=px.bar(
                    impact_analysis.sort_values('impact_factor', ascending=False),
                    x='condition',
                    y='impact_factor',
                    title="Demand Multipliers: Weather + Festival Combinations",
                    template='plotly_dark',
                    labels={'condition': 'Weather + Festival', 'impact_factor': 'Demand Multiplier'},
                    color='impact_factor',
                    color_continuous_scale='RdYlGn',
                    hover_data={'quantity_sold': ':.1f', 'observed_market_price': ':.2f'}
                )
            ), width=12)])
       

    ], fluid=True)
    return layout


if __name__ == '__main__':
    app = Dash(__name__)
    app.layout = html.Div("Inventory dashboard imported as a module.")
    app.run(debug=True)