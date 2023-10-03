from flask import Flask, render_template, request, jsonify, redirect, url_for
import pyodbc
import os
import base64
import time
import sqlite3
from werkzeug.utils import secure_filename
from flask import Blueprint, render_template

cadastrar_cliente_blueprint = Blueprint('cadastrar_cliente', __name__)

@cadastrar_cliente_blueprint.route('/cadastrar_cliente')
def cadastrar_cliente():
    return render_template('cadastrar-cliente.html')

app = Flask(__name__)



           
           

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
def get_filtered_clientes(nome_query):
    try:
        conn = pyodbc.connect(f'Driver={{SQL Server}};Server={server};Database={database};uid={username};pwd={password}')
        cursor = conn.cursor()
        query = "SELECT * FROM dbo.Clientes WHERE nome LIKE ?"
        cursor.execute(query, (nome_query + '%',))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        clientes = []
        for row in rows:
            
            cliente = {'cpf_cnpj': row.cpf_cnpj, 'nome': row.nome, 'email': row.email, 'tipo': row.tipo, 'cep': row.cep, 'pais': row.pais, 'uf': row.uf, 'cidade': row.cidade, 'logradouro': row.logradouro, 'bairro': row.bairro, 'numero': row.numero, 'complemento': row.complemento, 'telefone': row.telefone, 'data_cadastro': row.data_cadastro, 'situacao': row.situacao}
            clientes.append(cliente)

        # Fechar o cursor
        cursor.close()

        return jsonify({'clientes': clientes})
    except Exception as e:
        print(f"Erro ao obter a lista de usuários: {str(e)}")
        return jsonify({'error': 'Erro ao obter a lista de usuários'}), 500
    


# Adicionar user 
@cadastrar_cliente_blueprint.route('/add_cliente', methods=['POST'])
def add_cliente():
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    try:
        cpf_cnpj = request.form['cpf_cnpj']
        tipo = request.form['tipo']  # Novo campo para pessoa física ou jurídica
        nome = request.form['nome']
        email = request.form['email']
        cep = request.form['cep']
        pais = request.form['pais']
        uf = request.form['uf']
        cidade = request.form['cidade']
        logradouro = request.form['logradouro']
        bairro = request.form['bairro']
        numero = request.form['numero']
        complemento = request.form['complemento']
        telefone = request.form['telefone']
        data_cadastro = request.form['data_cadastro']
        situacao = request.form['situacao']

        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Inserir o novo cliente no banco de dados
        query = """
            INSERT INTO dbo.Clientes (nome, cpf_cnpj, email, tipo, cep, pais, uf,
            cidade, logradouro, bairro, numero, complemento,
            telefone, data_cadastro, situacao) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

        cursor.execute(query, (
            nome, cpf_cnpj, email, tipo, cep, pais, uf,
            cidade, logradouro, bairro, numero, complemento,
            telefone, data_cadastro, situacao
        ))

        conn.commit()
        cursor.close()

        return 'Success'
    except Exception as e:
        print(f"Erro ao cadastrar cliente: {str(e)}")
        return jsonify({'error': 'Erro ao cadastrar cliente'}), 500



# Rota para retornar a lista de usuários cadastrados
@cadastrar_cliente_blueprint.route('/clientes') 
def get_clientes():
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Executar a consulta para obter todos os usuários
        cursor.execute("SELECT * FROM dbo.Clientes")

        # Obter os resultados da consulta
        rows = cursor.fetchall()

        # Converter os resultados em uma lista de dicionários
        clientes = []
        for row in rows:
            
            cliente = {'cpf_cnpj': row.cpf_cnpj, 'nome': row.nome, 'email': row.email, 'tipo': row.tipo, 'cep': row.cep, 'pais': row.pais, 'uf': row.uf, 'cidade': row.cidade, 'logradouro': row.logradouro, 'bairro': row.bairro, 'numero': row.numero, 'complemento': row.complemento, 'telefone': row.telefone, 'data_cadastro': row.data_cadastro, 'situacao': row.situacao}
            clientes.append(cliente)

        # Fechar o cursor
        cursor.close()

        return jsonify({'clientes': clientes})
    except Exception as e:
        print(f"Erro ao obter a lista de usuários: {str(e)}")
        return jsonify({'error': 'Erro ao obter a lista de usuários'}), 500

# Variável de estado para acompanhar a ordem atual
ascending_order = True

# Rota para retornar a lista de usuários em ordem alfabética ou na ordem original
@cadastrar_cliente_blueprint.route('/clientes_ordered')
def get_ordered_clientes():
    global ascending_order  # Use a variável global
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Determinar a ordem da consulta com base na variável de estado
        order_by_clause = "ORDER BY nome ASC" if ascending_order else ""

        # Executar a consulta para obter todos os usuários, com ou sem ordem alfabética
        cursor.execute(f"SELECT * FROM dbo.Clientes {order_by_clause}")

        # Obter os resultados da consulta
        rows = cursor.fetchall()

         # Converter os resultados em uma lista de dicionários
        clientes = []
        for row in rows:
            
            cliente = {'cpf_cnpj': row.cpf_cnpj, 'nome': row.nome, 'email': row.email, 'tipo': row.tipo, 'cep': row.cep, 'pais': row.pais, 'uf': row.uf, 'cidade': row.cidade, 'logradouro': row.logradouro, 'bairro': row.bairro, 'numero': row.numero, 'complemento': row.complemento, 'telefone': row.telefone, 'data_cadastro': row.data_cadastro, 'situacao': row.situacao}
            clientes.append(cliente)


        # Fechar o cursor
        cursor.close()

        # Inverter o estado para a próxima chamada
        ascending_order = not ascending_order

        return jsonify({'clientes': clientes})
    except Exception as e:
        print(f"Erro ao obter a lista de usuários: {str(e)}")
        return jsonify({'error': 'Erro ao obter a lista de usuários'}), 500
    
@cadastrar_cliente_blueprint.route('/clientes/delete/<string:cpf_cnpj>', methods=['POST'])
def delete_cliente(cpf_cnpj):
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Verificar se o usuário existe
        cursor.execute("SELECT * FROM dbo.Clientes WHERE cpf_cnpj = ?", (cpf_cnpj,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Usuário não encontrado'}), 404

        # Excluir o usuário do banco de dados
        query = "DELETE FROM dbo.Clientes WHERE cpf_cnpj = ?"
        cursor.execute(query, (cpf_cnpj,))
        conn.commit()

        # Fechar o cursor
        cursor.close()

        return 'Success'
    except Exception as e:
        print(f"Erro ao excluir usuário: {str(e)}")
        return jsonify({'error': 'Erro ao excluir usuário'}), 500

#editar usuários

MAX_ATTEMPTS = 3

@cadastrar_cliente_blueprint.route('/clientes/<string:cpf_cnpj>', methods=['POST'])
def edit_cliente(cpf_cnpj):
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    attempts = 0

    while attempts < MAX_ATTEMPTS:
        try:
            # Verificar se o usuário existe
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM dbo.Clientes WHERE cpf_cnpj = ?", (cpf_cnpj,))
            row = cursor.fetchone()
            if not row:
                return jsonify({'error': 'Usuário não encontrado'}), 404

            # Obter os dados atualizados do formulário
            tipo = request.form.get('tipo')
            nome = request.form.get('nome')
            email = request.form.get('email')
            cep = request.form.get('cep')
            pais = request.form.get('pais')
            uf = request.form.get('uf')
            cidade = request.form.get('cidade')
            logradouro = request.form.get('logradouro')
            bairro = request.form.get('bairro')
            numero = request.form.get('numero')
            complemento = request.form.get('complemento')
            telefone = request.form.get('telefone')
            data_cadastro = request.form.get('data_cadastro')
            situacao = request.form.get('situacao')


            # Atualizar os dados do usuário no banco de dados
            query = """
                UPDATE dbo.Clientes
                SET nome = ?, email = ?, tipo = ?, cep = ?, pais = ?, uf= ?, cidade = ?, logradouro = ?, bairro = ?, numero = ?, complemento = ?, telefone = ?, data_cadastro = ?, situacao = ?
                
                WHERE cpf_cnpj = ?
            """
            cursor.execute(query, (nome, email, tipo, cep, pais, uf, cidade, logradouro, bairro, numero, complemento, telefone, data_cadastro, situacao, cpf_cnpj))
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

# Rota para buscar os dados do cliente pelo cpf_cnpj
@cadastrar_cliente_blueprint.route('/cliente/dados_cliente/<string:cpf_cnpj>')
def get_dados_cliente(cpf_cnpj):
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Executar a consulta para obter os dados do cliente pelo cpf_cnpj
        cursor.execute("SELECT * FROM dbo.Clientes WHERE cpf_cnpj = ?", cpf_cnpj)

        # Obter o resultado da consulta
        row = cursor.fetchone()

        # Verificar se o cliente foi encontrado
        if not row:
            return jsonify({'error': 'Cliente não encontrado'}), 404

        # Converter o resultado em um dicionário com os dados do cliente
        
        client_data = {
            'cpf_cnpj': row.cpf_cnpj,
            'nome': row.nome,
            'email': row.email,
            'tipo': row.tipo,
            'cep': row.cep,
            'pais': row.pais,
            'uf': row.uf,
            'cidade': row.cidade,
            'logradouro': row.logradouro,
            'bairro': row.bairro,
            'numero': row.numero,
            'complemento': row.complemento,
            'telefone': row.telefone,
            'data_cadastro': row.data_cadastro,
            'situacao': row.situacao
            # Adicione outros campos de cliente conforme necessário
        }

        # Fechar o cursor
        cursor.close()

        return jsonify(client_data)
    except Exception as e:
        print(f"Erro ao obter os dados do cliente: {str(e)}")
        return jsonify({'error': 'Erro ao obter os dados do cliente'}), 500



#Pesquisar usuários     
# Pesquisar usuários pelo cpf_cnpj
@cadastrar_cliente_blueprint.route('/clientes/<string:cpf_cnpj>')
def get_cliente(cpf_cnpj):
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Executar a consulta para obter o usuário pelo cpf_cnpj
        cursor.execute("SELECT * FROM dbo.Clientes WHERE cpf_cnpj = ?", cpf_cnpj)

        # Obter o resultado da consulta
        row = cursor.fetchone()

        # Verificar se o usuário foi encontrado
        if not row:
            return jsonify({'error': 'Usuário não encontrado'}), 404

        # Converter o resultado em um dicionário
        
        cliente = {'cpf_cnpj': row.cpf_cnpj,
            'nome': row.nome,
            'email': row.email,
            'tipo': row.tipo,
            'cep': row.cep,
            'pais': row.pais,
            'uf': row.uf,
            'cidade': row.cidade,
            'logradouro': row.logradouro,
            'bairro': row.bairro,
            'numero': row.numero,
            'complemento': row.complemento,
            'telefone': row.telefone,
            'data_cadastro': row.data_cadastro,
            'situacao': row.situacao}

        # Fechar o cursor
        cursor.close()

        return jsonify(cliente)
    except Exception as e:
        print(f"Erro ao obter os dados do usuário: {str(e)}")
        return jsonify({'error': 'Erro ao obter os dados do usuário'}), 500

# Rota para filtrar os usuários com base no termo de pesquisa
@cadastrar_cliente_blueprint.route('/search', methods=['GET'])
def search_clientes():
    search_query = request.args.get('q')

    # Verificar se foi fornecido um parâmetro de pesquisa
    if search_query:
        # Fazer a consulta no banco de dados para buscar usuários que correspondem à pesquisa
        cursor = conn.cursor()
        query = "SELECT * FROM dbo.Clientes WHERE nome LIKE ?"
        cursor.execute(query, (f'%{search_query}%',))
        clientes = cursor.fetchall()
        cursor.close()

        # Construir uma lista de dicionários com os dados dos usuários
        cliente_list = []
        for cliente in clientes:
            
            cliente_dict = {
                'cpf_cnpj': cliente.cpf_cnpj,
                'nome': cliente.nome,
                'email':cliente.email,
                'tipo': cliente.tipo,
                'cep': cliente.cep,
                'pais': cliente.pais,
                'uf': cliente.uf,
                'cidade': cliente.cidade,
                'logradouro': cliente.logradouro,
                'bairro': cliente.bairro,
                'numero': cliente.numero,
                'complemento': cliente.complemento,
                'telefone': cliente.telefone,
                'data_cadastro': cliente.data_cadastro,
                'situacao': cliente.situacao
                # Outros campos de usuário
            }
            cliente_list.append(cliente_dict)

        # Retornar a lista de usuários filtrada como resposta em formato JSON
        return jsonify({'clientes': cliente_list})

    # Se nenhum parâmetro de pesquisa for fornecido, retornar todos os usuários
    else:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM dbo.Clientes")
        clientes = cursor.fetchall()
        cursor.close()

        # Construir uma lista de dicionários com os dados de todos os usuários
        cliente_list = []
        for cliente in clientes:
            
            cliente_dict = {
                'cpf_cnpj': cliente.cpf_cnpj,
                'nome': cliente.nome,
                'email':cliente.email,
                'tipo': cliente.tipo,
                'cep': cliente.cep,
                'pais': cliente.pais,
                'uf': cliente.uf,
                'cidade': cliente.cidade,
                'logradouro': cliente.logradouro,
                'bairro': cliente.bairro,
                'numero': cliente.numero,
                'complemento': cliente.complemento,
                'telefone': cliente.telefone,
                'data_cadastro': cliente.data_cadastro,
                'situacao': cliente.situacao
                # Outros campos de usuário
            }
            cliente_list.append(cliente_dict)

        # Retornar a lista de todos os usuários como resposta em formato JSON
        return jsonify({'clientes': cliente_list})



