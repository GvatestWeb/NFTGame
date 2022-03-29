import requests
import datetime
from openpyxl import load_workbook

URL = 'https://cloud-api.yandex.net/v1/disk/resources'
TOKEN = 'AQAAAABaPnTEAAfHzEhJmoNQP0BertmVM4IFeL0'
headers = {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': f'OAuth {TOKEN}'}

def download_file(path:str, save:str):
    """
    path: path to download file
    save: path to save file
    """
    res = requests.get(f'{URL}/download?path={path}', headers=headers).json()
    file = requests.get(res["href"], allow_redirects=True)
    with open(save, "w") as f:
        f.write(file.content)

def upload_file(uploadfile:str, savefile:str, replace:bool=True):
    """
    savefile: path to disk file
    uploadfile: path to upload file
    replace: replace file (true or false)
    """
    res = requests.get(f'{URL}/upload?path={savefile}&overwrite={replace}', headers=headers).json()
    with open(uploadfile, 'rb') as f:
        try:
            requests.put(res['href'], files={'file':f})
        except KeyError as ex:
            with open("log.txt", "a") as f:
                f.write(f"can't upload file {datetime.datetime.now().date()}\n")

def write_file(path:str, data:list, sheet_name:str):
    """
    path: path to exel file
    data: data to append
    sheet_name: name of the sheet to write
    """
    wb = load_workbook(filename=path)
    ws = wb.active
    ws = wb[sheet_name]
    ws.append(data)
    wb.save(filename=path)
    wb.close()