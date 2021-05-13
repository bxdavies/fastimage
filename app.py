###########
# Modules #
###########
from flask import Flask, json, render_template, request, session, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
from flask_wtf import FlaskForm
from wtforms import SelectField, TextField, FileField
from wtforms import validators
from wtforms.validators import DataRequired, EqualTo
from flask_wtf.file import FileField, FileRequired
import os

###################
# Flask Variables #
###################
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['SECRET_KEY'] = '12345'

#########
# Forms #
#########


class frmCreateProduct(FlaskForm):
    fieName = TextField(u'Product Name', validators=[DataRequired()])
    fieType = TextField(u'Product Types or Size', validators=[DataRequired()])

##########
# Errors #
##########

##########
# Routes #
##########


@app.route('/')
def home():
    return render_template('index.html', title='Home')


@app.route('/products/create', methods=('GET', 'POST'))
def create_products():
    if frmCreateProduct().is_submitted():
        strProductName = frmCreateProduct().fieName.data
        strProductName = strProductName.strip()
        strProductName = strProductName.lower()
        strProductName = strProductName.replace(' ', '-')
        os.mkdir(f'static/products/{strProductName}')

        strProductTypes = frmCreateProduct().fieType.data
        lisProductTypes = strProductTypes.split(',')
        for strProductType in lisProductTypes:
            strProductType = strProductType.strip()
            strProductType = strProductType.lower()
            strProductType = strProductType.replace(' ', '-')
            os.mkdir(f'static/products/{strProductName}/{strProductType}')

    return render_template('products/create.html', title='Create a Product', frmCreateProduct=frmCreateProduct())


@app.route('/products/upload', methods=('GET', 'POST'))
def upload_products():
    class frmUploadProduct(FlaskForm):
        lisProducts = os.listdir('static/products')
        fieProduct = SelectField(u'Product', choices=lisProducts, validators=[DataRequired()], id='productName')
        fieType = SelectField(u'Type', validators=[DataRequired()], id='productType')
        fieFileName = TextField(u'File Name', validators=[DataRequired()])
        fieFile = FileField(u'File', validators=[FileRequired()])

    if frmUploadProduct().is_submitted():
        strProduct = frmUploadProduct().fieProduct.data
        strType = frmUploadProduct().fieType.data
        strFileName = frmUploadProduct().fieFileName.data
        file = frmUploadProduct().fieFile.data
        strFileName = strFileName.strip()
        strFileName = strFileName.lower()
        strFileName = strFileName.replace(' ', '-')
        filename, file_extension = os.path.splitext(file.filename)
        strFileName = strFileName + file_extension
        file.save(os.path.join('static/products', strProduct, strType, strFileName))

    return render_template('products/upload.html', title='Upload a Product', frmUploadProduct=frmUploadProduct())


@app.route('/upload', methods=('GET', 'POST'))
def upload_art():
    class frmUploadArt(FlaskForm):
        fieFileName = TextField(u'File Name', validators=[DataRequired()])
        fieFile = FileField(u'File', validators=[FileRequired()])

    if frmUploadArt().is_submitted():
        strFileName = frmUploadArt().fieFileName.data
        file = frmUploadArt().fieFile.data
        strFileName = strFileName.strip()
        strFileName = strFileName.lower()
        strFileName = strFileName.replace(' ', '-')
        filename, file_extension = os.path.splitext(file.filename)
        strFileName = strFileName + file_extension
        file.save(os.path.join('static/uploads', strFileName))

    return render_template('upload.html', title='Upload Art', frmUploadArt=frmUploadArt())


@app.route('/generate', methods=('GET', 'POST'))
def generate():
    lisFiles = []
    for strFile in os.listdir('static/uploads'):
        lisFiles.append(os.path.splitext(strFile)[0])

    lisProducts = os.listdir('static/products')

    class frmFiles(FlaskForm):
        fieProduct = SelectField(u'Product', choices=lisProducts, validators=[DataRequired()])
        fieFile = SelectField(u'Working Image', choices=lisFiles, validators=[DataRequired()])

    if frmFiles().is_submitted():
        session['product'] = frmFiles().fieProduct.data
        session['workingImage'] = frmFiles().fieFile.data
        return redirect(url_for('generator'))

    return render_template('generate.html', title='Generate Mockups', frmFiles=frmFiles())


@app.route('/generator')
def generator():
    return render_template('generator.html', title="Create T-Shirt", product=session['product'], workingImage=session['workingImage'])

#######
# Api #
#######


@app.route('/api/product/types')
def api_product_types():
    strProduct = request.args.get('product', '01', type=str)
    lisTypes = os.listdir(f'static/products/{strProduct}')
    return jsonify(lisTypes)


@app.route('/api/product/bases')
def api_product_bases():
    strProduct = request.args.get('product', '01', type=str)
    strType = request.args.get('type', '01', type=str)
    lisBases = []
    for strFile in os.listdir(f'static/products/{strProduct}/{strType}'):
        lisBases.append(os.path.splitext(strFile)[0])

    return jsonify(lisBases)

#########
# Start #
#########


if __name__ == "__main__":
    app.run(use_reloader=True, debug=True)
