from flask import Flask, render_template
from cadastrar_cliente import cadastrar_cliente_blueprint
from cadastrar_usuario import cadastrar_usuario_blueprint
from cadastrar_itens import cadastrar_itens_blueprint
from cadastrar_projetos import cadastrar_projetos_blueprint
from cadastrar_cronograma import cadastrar_cronograma_blueprint

app = Flask(__name__)
app.debug = True 
# Registrar os blueprints
app.register_blueprint(cadastrar_cliente_blueprint)
app.register_blueprint(cadastrar_usuario_blueprint)
app.register_blueprint(cadastrar_itens_blueprint)
app.register_blueprint(cadastrar_projetos_blueprint)
app.register_blueprint(cadastrar_cronograma_blueprint)
# Rota principal que renderiza a página inicial
@app.route('/')
def index():
    return render_template('index.html')
 
if __name__ == '__main__':
    app.run()
