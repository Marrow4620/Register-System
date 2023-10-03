import pyodbc
from flask import Blueprint, render_template

cadastrar_cronograma_blueprint = Blueprint('cadastrar_cronograma', __name__)

@cadastrar_cronograma_blueprint.route('/cadastrar-cronograma', methods=['GET'])
def cadastrar_cronograma():
    # Estabelecer a conexão com o banco de dados
    server = '#######'
    database = '###'
    username = '####'
    password = '########'
    conn = pyodbc.connect(f'Driver={{SQL Server}};Server={server};Database={database};uid={username};pwd={password}')

    if conn:
        print("Conexão bem-sucedida com o banco de dados.")
    else:
        print("Falha na conexão com o banco de dados.")

    return render_template('cadastrar-cronograma.html')