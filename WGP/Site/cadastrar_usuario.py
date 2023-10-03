from flask import Flask, render_template, request, jsonify, redirect, url_for
import pyodbc
import os
import base64
import time
import sqlite3
from werkzeug.utils import secure_filename
from flask import Blueprint, render_template

cadastrar_usuario_blueprint = Blueprint('cadastrar_usuario', __name__)

@cadastrar_usuario_blueprint.route('/cadastrar-usuario')
def cadastrar_usuario():
    return render_template('cadastrar-usuario.html')

app = Flask(__name__)




# Função para verificar a extensão do arquivo permitido
def allowed_file(filename):
    allowed_extensions = {'jpg', 'jpeg', 'png', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions
           
           

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

# Filtrar usuários
def get_filtered_users(name_query):
    try:
        conn = pyodbc.connect(f'Driver={{SQL Server}};Server={server};Database={database};uid={username};pwd={password}')
        cursor = conn.cursor()
        query = "SELECT * FROM dbo.Users WHERE name LIKE ?"
        cursor.execute(query, (name_query + '%',))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        users = []
        for row in rows:
            if row.photo is not None:
                photo_base64 = base64.b64encode(row.photo).decode('utf-8')
            else:
                photo_base64 = None
            user = {'login': row.login, 'name': row.name, 'email': row.email, 'user_type': row.user_type, 'photo': photo_base64, 'password': row.password}
            users.append(user)

        return users
    except Exception as e:
        print(f"Erro ao obter a lista de usuários: {str(e)}")
        return []


# Adicionar user 
@cadastrar_usuario_blueprint.route('/add_user', methods=['POST'])
def add_user():
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    try:
        name = request.form['name']
        email = request.form['email']
        user_type = request.form['user-type']
        photo = request.files['photo']
        password = request.form['password'] 
        login = request.form['login']
        # Definir photo_data como None por padrão
        photo_data = None

        # Verificar se um arquivo foi enviado e se é permitido
        if photo and allowed_file(photo.filename):
            # Ler o conteúdo do arquivo como bytes
            photo_data = photo.read()

        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Inserir o novo usuário no banco de dados
        query = "INSERT INTO dbo.Users (login, name, email, user_type, photo, password) VALUES (?, ?, ?, ?, ?, ?)"
        cursor.execute(query, login, name, email, user_type, photo_data, password)
        conn.commit()
        cursor.close()

        return 'Success'
    except Exception as e:
        print(f"Erro ao cadastrar usuário: {str(e)}")
        return jsonify({'error': 'Erro ao cadastrar usuário'}), 500



# Rota para retornar a lista de usuários cadastrados
@cadastrar_usuario_blueprint.route('/users') 
def get_users():
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Executar a consulta para obter todos os usuários
        cursor.execute("SELECT * FROM dbo.Users")

        # Obter os resultados da consulta
        rows = cursor.fetchall()

        # Converter os resultados em uma lista de dicionários
        users = []
        for row in rows:
            if row.photo is not None:
                photo_base64 = base64.b64encode(row.photo).decode('utf-8')
            else:
                photo_base64 = None
            user = {'login': row.login, 'name': row.name, 'email': row.email, 'user_type': row.user_type, 'photo': photo_base64, 'password': row.password}
            users.append(user)

        # Fechar o cursor
        cursor.close()

        return jsonify({'users': users})
    except Exception as e:
        print(f"Erro ao obter a lista de usuários: {str(e)}")
        return jsonify({'error': 'Erro ao obter a lista de usuários'}), 500
    


# Variável de estado para acompanhar a ordem atual
ascending_order = True

# Rota para retornar a lista de usuários em ordem alfabética ou na ordem original
@cadastrar_usuario_blueprint.route('/users_ordered')
def get_ordered_users():
    global ascending_order  # Use a variável global
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Determinar a ordem da consulta com base na variável de estado
        order_by_clause = "ORDER BY name ASC" if ascending_order else ""

        # Executar a consulta para obter todos os usuários, com ou sem ordem alfabética
        cursor.execute(f"SELECT * FROM dbo.Users {order_by_clause}")

        # Obter os resultados da consulta
        rows = cursor.fetchall()

        # Converter os resultados em uma lista de dicionários
        users = []
        for row in rows:
            if row.photo is not None:
                photo_base64 = base64.b64encode(row.photo).decode('utf-8')
            else:
                photo_base64 = None
            user = {'login': row.login, 'name': row.name, 'email': row.email, 'user_type': row.user_type, 'photo': photo_base64, 'password': row.password}
            users.append(user)

        # Fechar o cursor
        cursor.close()

        # Inverter o estado para a próxima chamada
        ascending_order = not ascending_order

        return jsonify({'users': users})
    except Exception as e:
        print(f"Erro ao obter a lista de usuários: {str(e)}")
        return jsonify({'error': 'Erro ao obter a lista de usuários'}), 500
    

    
@cadastrar_usuario_blueprint.route('/users/delete/<string:login>', methods=['POST'])
def delete_user(login):
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Verificar se o usuário existe
        cursor.execute("SELECT * FROM dbo.Users WHERE login = ?", (login,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Usuário não encontrado'}), 404

        # Excluir o usuário do banco de dados
        query = "DELETE FROM dbo.Users WHERE login = ?"
        cursor.execute(query, (login,))
        conn.commit()

        # Fechar o cursor
        cursor.close()

        return 'Success'
    except Exception as e:
        print(f"Erro ao excluir usuário: {str(e)}")
        return jsonify({'error': 'Erro ao excluir usuário'}), 500

#editar usuários

MAX_ATTEMPTS = 3

@cadastrar_usuario_blueprint.route('/users/<string:login>', methods=['POST'])
def edit_user(login):
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    attempts = 0

    while attempts < MAX_ATTEMPTS:
        try:
            # Verificar se o usuário existe
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM dbo.Users WHERE login = ?", (login,))
            row = cursor.fetchone()
            if not row:
                return jsonify({'error': 'Usuário não encontrado'}), 404

            # Obter os dados atualizados do formulário
            name = request.form.get('name')
            email = request.form.get('email')
            user_type = request.form.get('user-type')
            password = request.form.get('password')
            photo = request.files.get('photo')
            photo_data = None

            # Verificar se uma nova foto foi enviada e se é permitida
            if photo and allowed_file(photo.filename):
                photo_data = photo.read()

            # Atualizar os dados do usuário no banco de dados
            query = """
                UPDATE dbo.Users
                SET name = ?, email = ?, password = ?, photo = ?, user_type = ?
                WHERE login = ?
            """
            cursor.execute(query, (name, email, password, photo_data, user_type, login))
            conn.commit()
            cursor.close()

            return 'Success'
        except Exception as e:
            print(f"Erro ao editar usuário: {str(e)}")
            if 'Conexão ocupada com os resultados de outro HSTMT' in str(e):
                attempts += 1
                time.sleep(1)  # Aguardar 1 segundo e tentar novamente
                conn.commit()
            else:
                conn.rollback()
                return jsonify({'error': 'Erro ao editar usuário'}), 500

    return jsonify({'error': 'Erro ao editar usuário após várias tentativas'}), 500

# Rota para buscar os dados do cliente pelo login
@cadastrar_usuario_blueprint.route('/user/dados_user/<string:login>')
def get_dados_user(login):
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Executar a consulta para obter os dados do cliente pelo login
        cursor.execute("SELECT * FROM dbo.Users WHERE login = ?", login)

        # Obter o resultado da consulta
        row = cursor.fetchone()

        # Verificar se o cliente foi encontrado
        if not row:
            return jsonify({'error': 'Cliente não encontrado'}), 404

        # Converter o resultado em um dicionário com os dados do cliente
        if row.photo is not None:
            photo_base64 = base64.b64encode(row.photo).decode('utf-8')
        else:
            photo_base64 = None
        client_data = {
            'login': row.login,
            'name': row.name,
            'email': row.email,
            'user_type': row.user_type,
            'photo': photo_base64,
            # Adicione outros campos de cliente conforme necessário
        }

        # Fechar o cursor
        cursor.close()

        return jsonify(client_data)
    except Exception as e:
        print(f"Erro ao obter os dados do cliente: {str(e)}")
        return jsonify({'error': 'Erro ao obter os dados do cliente'}), 500



#Pesquisar usuários     
# Pesquisar usuários pelo login
@cadastrar_usuario_blueprint.route('/users/<string:login>')
def get_user(login):
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Executar a consulta para obter o usuário pelo login
        cursor.execute("SELECT * FROM dbo.Users WHERE login = ?", login)

        # Obter o resultado da consulta
        row = cursor.fetchone()

        # Verificar se o usuário foi encontrado
        if not row:
            return jsonify({'error': 'Usuário não encontrado'}), 404

        # Converter o resultado em um dicionário
        if row.photo is not None:
            photo_base64 = base64.b64encode(row.photo).decode('utf-8')
        else:
            photo_base64 = None
        user = {'login': row.login, 'name': row.name, 'email': row.email, 'user_type': row.user_type, 'photo': photo_base64, 'password': row.password}

        # Fechar o cursor
        cursor.close()

        return jsonify(user)
    except Exception as e:
        print(f"Erro ao obter os dados do usuário: {str(e)}")
        return jsonify({'error': 'Erro ao obter os dados do usuário'}), 500

# Rota para filtrar os usuários com base no termo de pesquisa
@cadastrar_usuario_blueprint.route('/search3', methods=['GET'])
def search_users():
    search_query = request.args.get('u')

    # Verificar se foi fornecido um parâmetro de pesquisa
    if search_query:
        # Fazer a consulta no banco de dados para buscar usuários que correspondem à pesquisa
        cursor = conn.cursor()
        query = "SELECT * FROM dbo.Users WHERE name LIKE ?"
        cursor.execute(query, (f'%{search_query}%',))
        users = cursor.fetchall()
        cursor.close()

        # Construir uma lista de dicionários com os dados dos usuários
        user_list = []
        for user in users:
            if user.photo is not None:
                photo_base64 = base64.b64encode(user.photo).decode('utf-8')
            else:
                photo_base64 = None
            user_dict = {
                'login': user.login,
                'name': user.name,
                'email': user.email,
                'user_type': user.user_type,
                'photo': photo_base64,  # Inclua a foto do usuário no dicionário
                'password': user.password
                # Outros campos de usuário
            }
            user_list.append(user_dict)

        # Retornar a lista de usuários filtrada como resposta em formato JSON
        return jsonify({'users': user_list})
    
    

    # Se nenhum parâmetro de pesquisa for fornecido, retornar todos os usuários
    else:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM dbo.Users")
        users = cursor.fetchall()
        cursor.close()

        # Construir uma lista de dicionários com os dados de todos os usuários
        user_list = []
        for user in users:
            if user.photo is not None:
                photo_base64 = base64.b64encode(user.photo).decode('utf-8')
            else:
                photo_base64 = None
            user_dict = {
                'login': user.login,
                'name': user.name,
                'email': user.email,
                'user_type': user.user_type,
                'photo': photo_base64,  # Inclua a foto do usuário no dicionário
                'password': user.password
                # Outros campos de usuário
            }
            user_list.append(user_dict)

        # Retornar a lista de todos os usuários como resposta em formato JSON
        return jsonify({'users': user_list})



