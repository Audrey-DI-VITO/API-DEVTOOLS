FROM php:8.1-apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN touch /var/www/html/index.html
RUN echo "test" >> /var/www/html/index.html
RUN chmod -R 777 /var/www/html
EXPOSE 8080