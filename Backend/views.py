from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from langchain.utilities import SQLDatabase
from langchain.llms import OpenAI
from langchain_experimental.sql import SQLDatabaseChain
import os
from django.http import JsonResponse
from rest_framework.decorators import api_view

os.environ["OPENAI_API_KEY"] = "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"
# Replace the following with your MySQL connection details
mysql_user = "root"
mysql_password = ""
mysql_host = "localhost"  # Typically "localhost" if it's on the same machine
mysql_database = "ipams"

# Create the SQLDatabase instance with the MySQL connection URI
db = SQLDatabase.from_uri(f"mysql://{mysql_user}:{mysql_password}@{mysql_host}/{mysql_database}"
                          ,include_tables=["search_researchpaper"],
)

llm = OpenAI(temperature=0, verbose=True)

db_chain = SQLDatabaseChain.from_llm(llm, db, verbose=True)

@api_view(["POST"])
def langchain_view(request):
    query = request.POST.get("query")
    response = db_chain(query)
    return JsonResponse({"response": response})