FROM python
COPY . /chat_project/backend
WORKDIR /chat_project/backend
RUN pip install -r requirements.txt
RUN python manage.py migrate
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]