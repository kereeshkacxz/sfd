import psycopg2

conn = psycopg2.connect(
    dbname="postgres",
    user="postgres.rxstuntghyogpxyufyqr",
    password="Yacool7930=",
    host="aws-0-eu-central-1.pooler.supabase.com",
    port="5432",
    sslmode="require"
)
cursor = conn.cursor()
cursor.execute("SELECT * FROM users;")  # Замени your_table на имя своей таблицы
print(cursor.fetchone())
conn.close()


# cmd: python test_db.py