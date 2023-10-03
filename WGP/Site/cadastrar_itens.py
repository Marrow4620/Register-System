from flask import Flask, render_template, request, jsonify, redirect, url_for
import pyodbc
import os
import base64
import time
import sqlite3
from werkzeug.utils import secure_filename
from flask import Blueprint, render_template

cadastrar_itens_blueprint = Blueprint('cadastrar_itens', __name__)

@cadastrar_itens_blueprint.route('/cadastrar-itens')
def cadastrar_itens():
    return render_template('cadastrar-itens.html')

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


# Filtrar itens
def get_filtered_items(item_query):
    try:
        conn = pyodbc.connect(f'Driver={{SQL Server}};Server={server};Database={database};uid={username};pwd={password}')
        cursor = conn.cursor()
        query = "SELECT I.ItemID, I.ItemName, i.Codigo, S.SubItemName, FROM dbo.Items AS I LEFT JOIN dbo.SubItems AS S ON I.ItemID = S.ParentItemID WHERE I.ItemName LIKE ?"
        cursor.execute(query, (item_query + '%',))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        items = []
        for row in rows:
            item = {'ItemID': row.ItemID,'Codigo': row.Codigo, 'ItemName': row.ItemName, 'SubItemName': row.SubItemName}
            items.append(item)
        
        # Fechar o cursor
        cursor.close()    


        return jsonify({'items': items})
    except Exception as e:
        print(f"Erro ao obter a lista de items: {str(e)}")
        return jsonify({'error': 'Erro ao obter a lista de items'}), 500



def adicionar_subitens_padrao(parent_item_id):
    subitens_padrao = [
        {'SubItemName': 'Teste ', 'CodigoSub': 1},
        {'SubItemName': 'Teste ', 'CodigoSub': 2},
        {'SubItemName': 'Teste ', 'CodigoSub': 3},
        {'SubItemName': 'Teste ', 'CodigoSub': 4},
        {'SubItemName': 'Teste ', 'CodigoSub': 5}
    ]

    cursor = conn.cursor()
    query = "INSERT INTO dbo.SubItems (SubItemName, ParentItemID, CodigoSub) VALUES (?, ?, ?)"

    for subitem in subitens_padrao:
        cursor.execute(query, (subitem['SubItemName'], parent_item_id, subitem['CodigoSub']))

    conn.commit()
    cursor.close()

# Modifique a função 'add_item' para chamar a função 'adicionar_subitens_padrao'
@cadastrar_itens_blueprint.route('/add_item', methods=['POST'])
def add_item():
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    try:
        ItemName = request.form['ItemName']
        Codigo = request.form['Codigo']  # Alterado de Codigo para ItemCodigo

        cursor = conn.cursor()
        query = "INSERT INTO dbo.Items (ItemName, Codigo) VALUES (?, ?)"
        cursor.execute(query, (ItemName, Codigo))

        conn.commit()
        cursor.close()
        
        cursor = conn.cursor()
        cursor.execute("SELECT @@IDENTITY AS LastID")
        last_id = cursor.fetchone()
        cursor.close()

        # Chame a função para adicionar os subitens padrões
        adicionar_subitens_padrao(last_id.LastID)

        return 'Success'
    except Exception as e:
        print(f"Erro ao cadastrar item: {str(e)}")
        return jsonify({'error': 'Erro ao cadastrar item'}), 500


@cadastrar_itens_blueprint.route('/add_subitem', methods=['POST'])
def add_subitem():
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    try:
        SubItemName= request.form['subitem']
        CodigoSub= int(request.form['CodigoSub'])
        ParentItemID = int(request.form['ParentItemID'])

        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Inserir o novo sub-item no banco de dados associado ao item pai
        query = "INSERT INTO dbo.SubItems (SubItemName, ParentItemID, CodigoSub) VALUES (?, ?, ?)"
        cursor.execute(query, (SubItemName, ParentItemID, CodigoSub))
        conn.commit()

        cursor.close()

        return 'Success'
    except Exception as e:
        print(f"Erro ao cadastrar sub-item: {str(e)}")
        return jsonify({'error': 'Erro ao cadastrar sub-item'}), 500
    



@cadastrar_itens_blueprint.route('/items')
def get_items():
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Executar a consulta para obter todos os itens e seus sub-itens
        # Executar a consulta para obter todos os itens e seus sub-itens ordenados por código
        cursor.execute("""
            SELECT i.ItemID, i.ItemName, i.Codigo AS ItemCodigo, s.SubItemID, s.SubItemName, s.CodigoSub
            FROM dbo.Items i
            LEFT JOIN dbo.SubItems s ON i.ItemID = s.ParentItemID
            ORDER BY ItemCodigo ASC, s.CodigoSub ASC
        """)


        # Obter os resultados da consulta
        rows = cursor.fetchall()

        # Converter os resultados em uma estrutura de dados hierárquica
        items = {}
        for row in rows:
            item_id = row.ItemID
            if item_id not in items:
                items[item_id] = {
                    'ItemID': row.ItemID,
                    'ItemName': row.ItemName,
                    'Codigo': row.ItemCodigo,  # Usar o campo "ItemCodigo" para evitar ambiguidade
                    'Subitems': []
                }
            if row.SubItemName:
                subitem_data = {
                    'SubItemID': row.SubItemID,  # Incluir o SubItemID
                    'SubItemName': row.SubItemName,
                    'CodigoSub': row.CodigoSub  # Incluir o código do subitem
                }
                items[item_id]['Subitems'].append(subitem_data)
                

        # Fechar o cursor
        cursor.close()

        # Converter a estrutura de dados em uma lista de dicionários
        item_list = list(items.values())

        return jsonify({'items': item_list})
    except Exception as e:
        print(f"Erro ao obter a lista de itens: {str(e)}")
        return jsonify({'error': 'Erro ao obter a lista de itens'}), 500


@cadastrar_itens_blueprint.route('/items/delete/<string:ItemID>', methods=['POST'])
def delete_item(ItemID):
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Verificar se o item existe
        cursor.execute("SELECT * FROM dbo.Items WHERE ItemID = ?", (ItemID,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Item não encontrado'}), 404

        # Excluir o item do banco de dados
        query = "DELETE FROM dbo.Items WHERE ItemID = ?"
        cursor.execute(query, (ItemID,))
        conn.commit()

        # Fechar o cursor
        cursor.close()

        return 'Success'
    except Exception as e:
        print(f"Erro ao excluir item: {str(e)}")
        return jsonify({'error': 'Erro ao excluir item'}), 500

#editar itens

@cadastrar_itens_blueprint.route('/items/<string:item>', methods=['POST'])
def edit_item(item):
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    try:
        # Verificar se o item existe
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM dbo.Items WHERE ItemID = ?", (item,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Item não encontrado'}), 404

        # Obter os dados atualizados do formulário para o item
        ItemName = request.form.get('ItemName')
        Codigo = request.form.get('Codigo')

        # Atualizar os dados do item no banco de dados
        query = """
            UPDATE dbo.Items
            SET ItemName = ?,
                Codigo = ?
            WHERE ItemID = ?
        """

        cursor.execute(query, (ItemName, Codigo, item))

        conn.commit()
        cursor.close()

        return 'Success'
    except Exception as e:
        print(f"Erro ao editar item: {str(e)}")
        conn.rollback()
        return jsonify({'error': 'Erro ao editar item'}), 500

    return 'Success'



@cadastrar_itens_blueprint.route('/update-item-data', methods=['POST'])
def update_item_data():
    if request.method != 'POST':
        return jsonify({'error': 'Método não permitido'}), 405

    try:
        data = request.json  # Obtenha os dados JSON do corpo da solicitação
        SubItemID = data.get('SubItemID')  # ID do item a ser atualizado
        newSubitemName = data.get('newSubitemName')
        newCodigoSub = data.get('newCodigoSub')

        print(f'SubItemID {SubItemID}')
        print(f'newSubitemName: {newSubitemName}')
        print(f'newCodigoSub: {newCodigoSub}')

        # Atualize os dados do item no banco de dados
        cursor = conn.cursor()
        cursor.execute("UPDATE dbo.SubItems SET SubItemName = ?, CodigoSub = ? WHERE SubItemID = ?", (newSubitemName, newCodigoSub, SubItemID))

        conn.commit()
        cursor.close()

        return jsonify({'message': 'Dados atualizados com sucesso'})
    except Exception as e:
        print(f"Erro ao editar item com subitens: {str(e)}")
        return jsonify({'error': 'Erro ao editar item com subitens'}), 500

    return 'Success'


# Rota para buscar os dados do item pelo nome
@cadastrar_itens_blueprint.route('/item/dados_item/<string:ItemID>')
def get_dados_item(ItemID):
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Executar a consulta para obter os dados do item pelo nome
        cursor.execute("SELECT * FROM dbo.Items WHERE ItemID = ?",ItemID)

        # Obter o resultado da consulta
        row = cursor.fetchone()

        # Verificar se o item foi encontrado
        if not row:
            return jsonify({'error': 'Item não encontrado'}), 404

        # Converter o resultado em um dicionário com os dados do item
        item_data = {
            'ItemName': row.ItemName,
            'SubItemName': row.SubItemName,
            'Codigo': row.Codigo
            
            # Adicione outros campos de item conforme necessário
        }

        # Fechar o cursor
        cursor.close()

        return jsonify(item_data)
    except Exception as e:
        print(f"Erro ao obter os dados do item: {str(e)}")
        return jsonify({'error': 'Erro ao obter os dados do item'}), 500

#Pesquisar itens
# Pesquisar itens pelo nome
@cadastrar_itens_blueprint.route('/items/<string:ItemID>')
def get_item(ItemID):
    try:
        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Executar a consulta para obter o item pelo nome
        cursor.execute( "SELECT I.*, S.SubItemName FROM dbo.Items AS I LEFT JOIN dbo.SubItems AS S ON I.ItemID = S.ParentItemID WHERE I.ItemID = ?",ItemID)

        # Obter o resultado da consulta
        row = cursor.fetchone()

        # Verificar se o item foi encontrado
        if not row:
            return jsonify({'error': 'Item não encontrado'}), 404

        # Converter o resultado em um dicionário
        item_dict = {
            'ItemName': row.ItemName,
            'ItemID' : row.ItemID,
            'SubItemName': row.SubItemName,
            'Codigo' : row.Codigo,
        }

        # Fechar o cursor
        cursor.close()

        return jsonify(item_dict)
    except Exception as e:
        print(f"Erro ao obter os dados do item: {str(e)}")
        return jsonify({'error': 'Erro ao obter os dados do item'}), 500




@cadastrar_itens_blueprint.route('/search2', methods=['GET'])
def search_items():
    search_query = request.args.get('f')

    if search_query:
        try:
            # Criar um novo cursor e conexão para cada consulta
            conn = pyodbc.connect(f'Driver={{SQL Server}};Server={server};Database={database};uid={username};pwd={password}')
            cursor = conn.cursor()

            query = """
                    SELECT i.ItemID, i.ItemName, i.Codigo, s.SubItemName
                    FROM dbo.Items i
                    LEFT JOIN dbo.SubItems s ON i.ItemID = s.ParentItemID
                    WHERE i.ItemName LIKE ? OR i.Codigo LIKE ? OR s.SubItemName LIKE ?
            """
            cursor.execute(query, (f'%{search_query}%', f'%{search_query}%', f'%{search_query}%'))
            items = cursor.fetchall()

            item_dict = {}
            for item in items:
                item_id = item.ItemID
                if item_id not in item_dict:
                    item_dict[item_id] = {
                        'ItemName': item.ItemName,
                         'Codigo' : item.Codigo,
                        'ItemID': item_id,
                        'SubItems': []
                    }
                if item.SubItemName:  # Adicione subitens ao dicionário do item
                    item_dict[item_id]['SubItems'].append(item.SubItemName)

            # Converter o dicionário em uma lista
            item_list = list(item_dict.values())

            cursor.close()
            conn.close()

            return jsonify({'items': item_list})

        except Exception as e:
            print(f"Erro ao obter a lista de itens: {str(e)}")
            return jsonify({'error': 'Erro ao obter a lista de itens'}), 500
    else:
        try:
            # Criar um novo cursor e conexão para cada consulta
            conn = pyodbc.connect(f'Driver={{SQL Server}};Server={server};Database={database};uid={username};pwd={password}')
            cursor = conn.cursor()

            query = """
                SELECT i.ItemID, i.ItemName, i.Codigo, s.SubItemName
                FROM dbo.Items i
                LEFT JOIN dbo.SubItems s ON i.ItemID = s.ParentItemID
                WHERE i.ItemName LIKE ? OR i.Codigo LIKE ? OR s.SubItemName LIKE ?
            """

            cursor.execute(query, (f'%{search_query}%', f'%{search_query}%', f'%{search_query}%'))

            items = cursor.fetchall()

            item_dict = {}
            for item in items:
                item_id = item.ItemID
                if item_id not in item_dict:
                    item_dict[item_id] = {
                        'ItemName': item.ItemName,
                        'ItemID': item_id,
                        'Codigo': item.Codigo,  # Corrija esta linha
                        'SubItems': []  # Sempre inicie com uma lista vazia
                    }
                if item.SubItemName:  # Adicione subitens ao dicionário do item
                    item_dict[item_id]['SubItems'].append(item.SubItemName)


            # Converter o dicionário em uma lista
            item_list = list(item_dict.values())

            cursor.close()
            conn.close()

            return jsonify({'items': item_list})

        except Exception as e:
            print(f"Erro ao obter a lista de itens: {str(e)}")
            return jsonify({'error': 'Erro ao obter a lista de itens'}), 500
