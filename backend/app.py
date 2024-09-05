from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime

app = Flask(__name__)
CORS(app)

uri = "mongodb+srv://sambitmondal02:1234@c0.zarb9sv.mongodb.net/?retryWrites=true&w=majority&appName=c0"
client = MongoClient(uri, server_api=ServerApi('1'))
database = client["jsondata"]
collection = database["data"]

# Apis to populate the Filters
@app.route('/api/vars', methods=['GET'])
def get_vars():
    if request.method == 'GET':
        return ["", "intensity", "likelihood", "relevance", "country", "topic", "region"]

@app.route('/api/filter_topic', methods=['GET'])
def get_filter_topic():
    if request.method == 'GET':
        return collection.distinct("topic")

@app.route('/api/filter_sector', methods=['GET'])
def get_filter_sector():
    if request.method == 'GET':
        return collection.distinct("sector")
    
@app.route('/api/filter_region', methods=['GET'])
def get_filter_region():
    if request.method == 'GET':
        return collection.distinct("region")
    
@app.route('/api/filter_pestle', methods=['GET'])
def get_filter_pestle():
    if request.method == 'GET':
        return collection.distinct("pestle")
    
@app.route('/api/filter_source', methods=['GET'])
def get_filter_source():
    if request.method == 'GET':
        return collection.distinct("source")
    
@app.route('/api/filter_country', methods=['GET'])
def get_filter_country():
    if request.method == 'GET':
        return collection.distinct("country")

#API to generate the datasets
@app.route('/api/dataset', methods=['POST'])
def get_data_test():
    if request.method == 'POST':
        var = request.get_json().get('var')
        filter_endyear = request.get_json().get('filter_endyear')
        filter_topic = request.get_json().get('filter_topic')
        filter_sector = request.get_json().get('filter_sector')
        filter_region = request.get_json().get('filter_region')
        filter_pestle = request.get_json().get('filter_pestle')
        filter_source = request.get_json().get('filter_source')
        filter_country = request.get_json().get('filter_country')

        query = {}

        if filter_endyear != "None":
            end_year = int(filter_endyear)
            if end_year <= 2025:
                start_year = 2016
            else:
                start_year = 2025
            query['end_year'] = {"$gte": start_year, "$lte": end_year}

        if filter_topic != "None":
            query['topic'] = filter_topic

        if filter_sector != "None":
            query['sector'] = filter_sector
        
        if filter_region != "None":
            query['region'] = filter_region
        
        if filter_pestle != "None":
            query['pestle'] = filter_pestle

        if filter_source != "None":
            query['source'] = filter_source
        
        if filter_country != "None":
            query['country'] = filter_country


        data = collection.find(query).distinct(var)
        
        items_with_counts = []
        for item in data:
            if item != "":
                count = collection.count_documents({var: item})
                items_with_counts.append((item, count / 10))
        
        items_with_counts.sort(key=lambda x: x[1], reverse=True)
        
        top_items = items_with_counts[:30]
        other_items = items_with_counts[30:]
        
        
        others_count = sum(count for item, count in other_items)
        
        filtered_data = [item for item, count in top_items]
        counts = [count for item, count in top_items]
        
        if other_items:
            filtered_data.append("Others")
            counts.append(others_count)

        return jsonify({"data": filtered_data, "counts": counts})
