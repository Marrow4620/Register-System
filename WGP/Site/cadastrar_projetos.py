from flask import Flask, render_template, request, jsonify, redirect, url_for
import pyodbc
import os
import base64
import time
import sqlite3
from werkzeug.utils import secure_filename
from flask import Blueprint, render_template

cadastrar_projetos_blueprint = Blueprint('cadastrar_projetos', __name__)

@cadastrar_projetos_blueprint.route('/cadastrar-projetos', methods=['GET'])
def cadastrar_projetos():
    

    return render_template('cadastrar-projetos.html')


           
           

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
def get_filtered_projetos(nome_query):
    try:
        conn = pyodbc.connect(f'Driver={{SQL Server}};Server={server};Database={database};uid={username};pwd={password}')
        cursor = conn.cursor()
        query = "SELECT * FROM dbo.Clientes WHERE EscopoProjeto LIKE ?"
        cursor.execute(query, (nome_query + '%',))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        projetos = []
        for row in rows:
            
            projeto = {
            'Cliente': row.Cliente,
            'TipoProjeto': row.TipoProjeto,
            'Consultor': row.Consultor,
            'EscopoProjeto': row.EscopoProjeto,
            'GPCliente': row.GPCliente,
            'GPWinnercon': row.GPWinnercon,
            'TipoFaturamento': row.TipoFaturamento,
            'TipoServidor': row.TipoServidor,
            'Proposta': row.Proposta,
            'ResponsavelAssinou': row.ResponsavelAssinou,
            'Assinado': row.Assinado,
            'Horas': row.Horas,
            'ValorHora': row.ValorHora,
            'Inicio': row.Inicio,
            'Termino': row.Termino,
            'Status': row.Status
        }

        projetos.append(projeto)

        # Fechar o cursor
        cursor.close()

        return jsonify({'projetos': projetos})
    except Exception as e:
        print(f"Erro ao obter a lista de usuários: {str(e)}")
        return jsonify({'error': 'Erro ao obter a lista de usuários'}), 500
    


# Adicionar user 
# Adicionar projeto
@cadastrar_projetos_blueprint.route('/add_projeto', methods=['POST'])
def add_projeto():
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    try:
        Cliente = request.form['Cliente']  # ID do cliente selecionado
    except Exception as e:
        print(f"Erro no campo 'cliente': {str(e)}")
        return jsonify({'error': 'Erro no campo "cliente"'}), 400

    try:
        TipoProjeto= request.form['TipoProjeto']
    except Exception as e:
        print(f"Erro no campo 'TipoProjeto': {str(e)}")
        return jsonify({'error': 'Erro no campo "TipoProjeto"'}), 400

    try:
        Consultor = request.form['Consultor']  # ID do consultor selecionado
    except Exception as e:
        print(f"Erro no campo 'consultor': {str(e)}")
        return jsonify({'error': 'Erro no campo "consultor"'}), 400

    try:
       EscopoProjeto = request.form['EscopoProjeto']  # Correção aqui para NVARCHAR
    except Exception as e:
        print(f"Erro no campo 'EscopoProjeto': {str(e)}")
        return jsonify({'error': 'Erro no campo "EscopoProjeto"'}), 400

    try:
       GPCliente = request.form['GPCliente']
    except Exception as e:
        print(f"Erro no campo 'gp_cliente': {str(e)}")
        return jsonify({'error': 'Erro no campo "gp_cliente"'}), 400

    try:
       GPWinnercon = request.form['GPWinnercon']
    except Exception as e:
        print(f"Erro no campo 'GPWinnercon': {str(e)}")
        return jsonify({'error': 'Erro no campo "GPWinnercon"'}), 400

    try:
        TipoFaturamento = request.form['TipoFaturamento']
    except Exception as e:
        print(f"Erro no campo 'TipoFaturamento': {str(e)}")
        return jsonify({'error': 'Erro no campo "TipoFaturamento"'}), 400

    try:
        TipoServidor = request.form['TipoServidor']
    except Exception as e:
        print(f"Erro no campo 'TipoServidor': {str(e)}")
        return jsonify({'error': 'Erro no campo "TipoServidor"'}), 400

    try:
        Proposta = request.form['Proposta']
    except Exception as e:
        print(f"Erro no campo 'proposta': {str(e)}")
        return jsonify({'error': 'Erro no campo "proposta"'}), 400

    try:
        ResponsavelAssinou = request.form['ResponsavelAssinou']
    except Exception as e:
        print(f"Erro no campo 'ResponsavelAssinou': {str(e)}")
        return jsonify({'error': 'Erro no campo "ResponsavelAssinou"'}), 400

    try:
        Assinado = request.form['Assinado']
    except Exception as e:
        print(f"Erro no campo 'assinado': {str(e)}")
        return jsonify({'error': 'Erro no campo "assinado"'}), 400

    try:
        Horas = int(request.form['Horas'])
    except Exception as e:
        print(f"Erro no campo 'horas': {str(e)}")
        return jsonify({'error': 'Erro no campo "horas"'}), 400

    try:
         ValorHora = float(request.form['ValorHora'])
    except Exception as e:
        print(f"Erro no campo ' ValorHora': {str(e)}")
        return jsonify({'error': 'Erro no campo " ValorHora"'}), 400

    try:
        Inicio = request.form['Inicio']
    except Exception as e:
        print(f"Erro no campo 'inicio': {str(e)}")
        return jsonify({'error': 'Erro no campo "inicio"'}), 400

    try:
        Termino = request.form['Termino']
    except Exception as e:
        print(f"Erro no campo 'termino': {str(e)}")
        return jsonify({'error': 'Erro no campo "termino"'}), 400

    try:
        Status = request.form['Status']
    except Exception as e:
        print(f"Erro no campo 'status': {str(e)}")
        return jsonify({'error': 'Erro no campo "status"'}), 400

    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Inserir o novo projeto no banco de dados
        query = """
            INSERT INTO dbo.Projetos ( Cliente, TipoProjeto, Consultor, EscopoProjeto,
            GPCliente, GPWinnercon, TipoFaturamento, TipoServidor, Proposta,
            ResponsavelAssinou, Assinado, Horas, ValorHora, Inicio, Termino, Status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

        cursor.execute(query, (
            Cliente, TipoProjeto, Consultor, EscopoProjeto,
           GPCliente, GPWinnercon, TipoFaturamento, TipoServidor, Proposta,
            ResponsavelAssinou, Assinado, Horas,  ValorHora, Inicio, Termino, Status
        ))

        print("Projeto inserido no banco de dados.")

        conn.commit()
        cursor.close()

        print("Transação confirmada e cursor fechado.")
        return 'Success'
    except Exception as e:
        print(f"Erro ao cadastrar projeto: {str(e)}")
        return jsonify({'error': 'Erro ao cadastrar projeto'}), 500


@cadastrar_projetos_blueprint.route('/add_projeto_form')
def add_projeto_form():
    try:
        # Conectar ao banco de dados
        conn = pyodbc.connect(f'Driver={{SQL Server}};Server={server};Database={database};uid={username};pwd={password}')
        cursor = conn.cursor()

        # Buscar os nomes dos clientes da tabela Dbo.Clientes
        query = "SELECT nome FROM Dbo.Clientes"
        cursor.execute(query)
        clientes = [row.nome for row in cursor.fetchall()]
        print(clientes)

        # Fechar a conexão com o banco de dados
        cursor.close()
        conn.close()

        # Retornar os dados dos clientes como um objeto JSON
        return jsonify({'clientes': clientes})
    except Exception as e:
        print(f"Erro ao buscar nomes dos clientes: {str(e)}")
        return jsonify({'error': 'Erro ao buscar nomes dos clientes'}), 500
    

@cadastrar_projetos_blueprint.route('/add_consultor_form')
def add_consultor_form():
    try:
        # Conectar ao banco de dados
        conn = pyodbc.connect(f'Driver={{SQL Server}};Server={server};Database={database};uid={username};pwd={password}')
        cursor = conn.cursor()

        # Buscar os nomes dos consultores da tabela Dbo.Users
        query = "SELECT name FROM Dbo.Users"
        cursor.execute(query)
        consultores = [row.name for row in cursor.fetchall()]
        print(consultores)

        # Fechar a conexão com o banco de dados
        cursor.close()
        conn.close()

        # Retornar os dados dos consultores como um objeto JSON
        return jsonify({'consultores': consultores})
    except Exception as e:
        print(f"Erro ao buscar nomes dos consultores: {str(e)}")
        return jsonify({'error': 'Erro ao buscar nomes dos consultores'}), 500




# Rota para retornar a lista de usuários cadastrados
@cadastrar_projetos_blueprint.route('/projetos') 
def get_projetos():
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Executar a consulta para obter todos os usuários
        cursor.execute("SELECT * FROM dbo.Projetos")

        # Obter os resultados da consulta
        rows = cursor.fetchall()

        # Converter os resultados em uma lista de dicionários
        projetos = []
        for row in rows:
            projeto = {
                'Cliente': row.Cliente,
                'TipoProjeto': row.TipoProjeto,
                'Consultor': row.Consultor,
                'EscopoProjeto': row.EscopoProjeto,
                'GPCliente': row.GPCliente,
                'GPWinnercon': row.GPWinnercon,
                'TipoFaturamento': row.TipoFaturamento,
                'TipoServidor': row.TipoServidor,
                'Proposta': row.Proposta,
                'ResponsavelAssinou': row.ResponsavelAssinou,
                'Assinado': row.Assinado,
                'Horas': row.Horas,
                'ValorHora': row.ValorHora,
                'Inicio': row.Inicio,
                'Termino': row.Termino,
                'Status': row.Status
            }
            projetos.append(projeto)

        # Fechar o cursor
        cursor.close()

        return jsonify({'projetos':projetos})
    except Exception as e:
        print(f"Erro ao obter a lista de usuários: {str(e)}")
        return jsonify({'error': 'Erro ao obter a lista de usuários'}), 500

# Variável de estado para acompanhar a ordem atual
ascending_order = True

# Rota para retornar a lista de usuários em ordem alfabética ou na ordem original
@cadastrar_projetos_blueprint.route('/projetos_ordered')
def get_ordered_projetos():
    global ascending_order  # Use a variável global
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Determinar a ordem da consulta com base na variável de estado
        order_by_clause = "ORDER BY EscopoProjeto ASC" if ascending_order else ""

        # Executar a consulta para obter todos os usuários, com ou sem ordem alfabética
        cursor.execute(f"SELECT * FROM dbo.Projetos {order_by_clause}")

        # Obter os resultados da consulta
        rows = cursor.fetchall()

        # Converter os resultados em uma lista de dicionários
        projetos = []
        for row in rows:
            projeto = {
                'Cliente': row.Cliente,
                'TipoProjeto': row.TipoProjeto,
                'Consultor': row.Consultor,
                'EscopoProjeto': row.EscopoProjeto,
                'GPCliente': row.GPCliente,
                'GPWinnercon': row.GPWinnercon,
                'TipoFaturamento': row.TipoFaturamento,
                'TipoServidor': row.TipoServidor,
                'Proposta': row.Proposta,
                'ResponsavelAssinou': row.ResponsavelAssinou,
                'Assinado': row.Assinado,
                'Horas': row.Horas,
                'ValorHora': row.ValorHora,
                'Inicio': row.Inicio,
                'Termino': row.Termino,
                'Status': row.Status
            }
            projetos.append(projeto)

        # Fechar o cursor
        cursor.close()


        # Inverter o estado para a próxima chamada
        ascending_order = not ascending_order

        return jsonify({'projetos':projetos})
    except Exception as e:
        print(f"Erro ao obter a lista de usuários: {str(e)}")
        return jsonify({'error': 'Erro ao obter a lista de usuários'}), 500

    
@cadastrar_projetos_blueprint.route('/projetos/delete/<string:EscopoProjeto>', methods=['POST'])
def delete_projeto(EscopoProjeto):
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Verificar se o usuário existe
        cursor.execute("SELECT * FROM dbo.Projetos WHERE EscopoProjeto = ?", (EscopoProjeto,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Usuário não encontrado'}), 404

        # Excluir o usuário do banco de dados
        query = "DELETE FROM dbo.Projetos WHERE EscopoProjeto = ?"
        cursor.execute(query, (EscopoProjeto,))
        conn.commit()

        # Fechar o cursor
        cursor.close()

        return 'Success'
    except Exception as e:
        print(f"Erro ao excluir usuário: {str(e)}")
        return jsonify({'error': 'Erro ao excluir usuário'}), 500

#editar usuários

MAX_ATTEMPTS = 3

@cadastrar_projetos_blueprint.route('/projetos/<string:EscopoProjeto>', methods=['POST'])
def edit_projeto(EscopoProjeto):
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    attempts = 0

    while attempts < MAX_ATTEMPTS:
        try:
            # Verificar se o usuário existe
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM dbo.Projetos WHERE EscopoProjeto = ?", (EscopoProjeto,))
            row = cursor.fetchone()
            if not row:
                return jsonify({'error': 'Usuário não encontrado'}), 404

            # Obter os dados atualizados do formulário
            Cliente = request.form.get('Cliente')
            TipoProjeto = request.form.get('TipoProjeto')
            Consultor = request.form.get('Consultor')
            GPCliente = request.form.get('GPCliente')
            GPWinnercon = request.form.get('GPWinnercon')
            TipoFaturamento = request.form.get('TipoFaturamento')
            TipoServidor = request.form.get('TipoServidor')
            Proposta = request.form.get('Proposta')
            ResponsavelAssinou = request.form.get('ResponsavelAssinou')
            Assinado = request.form.get('Assinado')
            Horas = request.form.get('Horas')
            ValorHora = request.form.get('ValorHora')
            Inicio = request.form.get('Inicio')
            Termino = request.form.get('Termino')
            Status = request.form.get('Status')



            # Atualizar os dados do usuário no banco de dados
            query = """
                UPDATE dbo.Projetos
                SET Cliente = ?, TipoProjeto = ?, Consultor = ?, GPCliente = ?, GPWinnercon = ?, TipoFaturamento = ?, TipoServidor = ?, Proposta = ?, ResponsavelAssinou = ?, Assinado = ?, Horas = ?, ValorHora = ?, Inicio = ?, Termino = ?, Status = ?
                
                WHERE EscopoProjeto = ?
            """
            cursor.execute(query, (
                Cliente, TipoProjeto, Consultor, GPCliente, GPWinnercon,
                TipoFaturamento, TipoServidor, Proposta, ResponsavelAssinou,
                Assinado, Horas, ValorHora, Inicio, Termino, Status, EscopoProjeto
            ))
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


# Rota para buscar os dados do projeto pelo EscopoProjeto
@cadastrar_projetos_blueprint.route('/projeto/dados_projeto/<string:EscopoProjeto>')
def get_dados_projeto(EscopoProjeto):
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Executar a consulta para obter os dados do projeto pelo cpf_cnpj
        cursor.execute("SELECT * FROM dbo.Projetos WHERE EscopoProjeto = ?", EscopoProjeto)

        # Obter o resultado da consulta
        row = cursor.fetchone()

        # Verificar se o projeto foi encontrado
        if not row:
            return jsonify({'error': 'Projeto não encontrado'}), 404

        # Converter o resultado em um dicionário com os dados do projeto
        
        projeto_data = {
            'Cliente': row.Cliente,
            'TipoProjeto': row.TipoProjeto,
            'Consultor': row.Consultor,
            'EscopoProjeto': row.EscopoProjeto,
            'GPCliente': row.GPCliente,
            'GPWinnercon': row.GPWinnercon,
            'TipoFaturamento': row.TipoFaturamento,
            'TipoServidor': row.TipoServidor,
            'Proposta': row.Proposta,
            'ResponsavelAssinou': row.ResponsavelAssinou,
            'Assinado': row.Assinado,
            'Horas': row.Horas,
            'ValorHora': row.ValorHora,
            'Inicio': row.Inicio,
            'Termino': row.Termino,
            'Status': row.Status
            # Adicione outros campos de projeto conforme necessário
        }

        # Fechar o cursor
        cursor.close()

        return jsonify(projeto_data)
    except Exception as e:
        print(f"Erro ao obter os dados do projeto: {str(e)}")
        return jsonify({'error': 'Erro ao obter os dados do projeto'}), 500



#Pesquisar usuários     
# Pesquisar usuários pelo EscopoProjeto
@cadastrar_projetos_blueprint.route('/projetos/<string:EscopoProjeto>')
def get_projeto(EscopoProjeto):
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Executar a consulta para obter o usuário pelo EscopoProjeto
        cursor.execute("SELECT * FROM dbo.Projetos WHERE EscopoProjeto = ?", EscopoProjeto)

        # Obter o resultado da consulta
        row = cursor.fetchone()

        # Verificar se o usuário foi encontrado
        if not row:
            return jsonify({'error': 'Usuário não encontrado'}), 404

        # Converter o resultado em um dicionário
        
        projeto = {'EscopoProjeto': row.EscopoProjeto,
            'Cliente': row.Cliente,
            'TipoProjeto': row.TipoProjeto,
            'Consultor': row.Consultor,
            'GPCliente': row.GPCliente,
            'GPWinnercon': row.GPWinnercon,
            'TipoFaturamento': row.TipoFaturamento,
            'TipoServidor': row.TipoServidor,
            'Proposta': row.Proposta,
            'ResponsavelAssinou': row.ResponsavelAssinou,
            'Assinado': row.Assinado,
            'Horas': row.Horas,
            'ValorHora': row.ValorHora,
            'Inicio': row.Inicio,
            'Termino': row.Termino,
            'Status': row.Status}

        # Fechar o cursor
        cursor.close()

        return jsonify(projeto)
    except Exception as e:
        print(f"Erro ao obter os dados do usuário: {str(e)}")
        return jsonify({'error': 'Erro ao obter os dados do usuário'}), 500

# Rota para filtrar os usuários com base no termo de pesquisa
@cadastrar_projetos_blueprint.route('/search4', methods=['GET'])
def search_projetos():
    search_query = request.args.get('p')

    # Verificar se foi fornecido um parâmetro de pesquisa
    if search_query:
        # Fazer a consulta no banco de dados para buscar usuários que correspondem à pesquisa
        cursor = conn.cursor()
        query = "SELECT * FROM dbo.Projetos WHERE EscopoProjeto LIKE ?"
        cursor.execute(query, (f'%{search_query}%',))
        projetos = cursor.fetchall()
        cursor.close()

        # Construir uma lista de dicionários com os dados dos usuários
        projeto_list = []
        for projeto in projetos:
            
            projeto_dict = {
                'EscopoProjeto': projeto.EscopoProjeto,
                'Cliente': projeto.Cliente,
                'TipoProjeto': projeto.TipoProjeto,
                'Consultor': projeto.Consultor,
                'GPCliente': projeto.GPCliente,
                'GPWinnercon': projeto.GPWinnercon,
                'TipoFaturamento': projeto.TipoFaturamento,
                'TipoServidor': projeto.TipoServidor,
                'Proposta': projeto.Proposta,
                'ResponsavelAssinou': projeto.ResponsavelAssinou,
                'Assinado': projeto.Assinado,
                'Horas': projeto.Horas,
                'ValorHora': projeto.ValorHora,
                'Inicio': projeto.Inicio,
                'Termino': projeto.Termino,
                'Status': projeto.Status
    # Outros campos do projeto
}

              
            
            projeto_list.append(projeto_dict)

        # Retornar a lista de usuários filtrada como resposta em formato JSON
        return jsonify({'projetos': projeto_list})

    # Se nenhum parâmetro de pesquisa for fornecido, retornar todos os usuários
    else:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM dbo.Projetos")
        projetos = cursor.fetchall()
        cursor.close()

        # Construir uma lista de dicionários com os dados de todos os usuários
        projeto_list = []
        for projeto in projetos:
            
            projeto_dict = {
                'EscopoProjeto': projeto.EscopoProjeto,
                'Cliente': projeto.Cliente,
                'TipoProjeto': projeto.TipoProjeto,
                'Consultor': projeto.Consultor,
                'GPCliente': projeto.GPCliente,
                'GPWinnercon': projeto.GPWinnercon,
                'TipoFaturamento': projeto.TipoFaturamento,
                'TipoServidor': projeto.TipoServidor,
                'Proposta': projeto.Proposta,
                'ResponsavelAssinou': projeto.ResponsavelAssinou,
                'Assinado': projeto.Assinado,
                'Horas': projeto.Horas,
                'ValorHora': projeto.ValorHora,
                'Inicio': projeto.Inicio,
                'Termino': projeto.Termino,
                'Status': projeto.Status
                # Outros campos de usuário
            }
            projeto_list.append(projeto_dict)

        # Retornar a lista de todos os usuários como resposta em formato JSON
        return jsonify({'projetos': projeto_list})



