import pytest
from flask import Flask, g
from server import create_app
from server.db import get_db

SCHEMA = """
            CREATE TABLE IF NOT EXISTS coins
            (
                [id] VARCHAR(20) PRIMARY KEY,
                [name] VARCHAR(50),
                [image_thumb] TEXT,
                [symbol] TEXT,
                [market_cap_rank] INTEGER,
                [market_cap_usd] REAL,
                [fully_diluted_valuation_usd] REAL,
                [circulating_supply] REAL,
                [total_supply] REAL,
                [max_supply] REAL,
                [current_price] REAL,
                [price_change_percentage_24h] REAL,
                [price_change_percentage_7d] REAL,
                [price_change_percentage_30d] REAL,
                [price_change_percentage_1y] REAL,
                [ath_change_percentage] REAL
            );
        """


def create_db(db):
    cur = db.cursor()
    cur.execute(SCHEMA)
    db.commit()


def clear_db(app):
    with app.app_context():
        db = get_db()
        db.cursor().execute(
            """
                    DELETE FROM coins;
                """
        )
        db.commit()


@pytest.fixture(scope="module")
def app():
    app = create_app(config_location="config.testing")
    with app.app_context():
        db = get_db()
        g._db = db
        create_db(db)
        yield app


@pytest.fixture(scope="function")
def client(app: Flask):
    yield app.test_client()
    clear_db(app)
