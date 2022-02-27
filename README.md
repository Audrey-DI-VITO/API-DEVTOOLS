# API-DEVTOOLS

### Technologies utilisées

Cette API REST fonctionne avec Docker, NodeJS et minio qui est un service de S3 gratuit.

### Fonctionnalités

Les fichiers de l'API se transmettent directement au conteneur qui va gérer la partie NodeJS.

Toutes les routes demandées ont été faites.

```
delete : localhost:3000/books/{isbn}
create : locahost:3000/books
update (patch) : localhost:3000/books/{isbn}
getAll : localhost:3000/books
getByIsbn : localhost:3000/books/{isbn}
```

### Fonctionnement

Dans le cas ou vous souhaitez utliser le service S3 minio, il faut que vous déplaciez l'image dans le répertoire ``/nodeDocker/src/pictures``.
Elles seront naturellements ajoutées au conteneur Node pour pouvoir s'en servir ensuite.

#### Ports d'écoutes

```
Minio : 
        port 9000 pour l'api
        port 9001 pour la console
              - username : minio
              - password : minio123
API :
        port 3000

MySQL :
        port 3306
```

### Contribuer

Pour lancer l'application et donc la création et le lancement des conteneurs, il faut lancer la commande ``docker-compose up --build``.

### Déploiement

Pour s'assurer le bon fonctionnement de l'application, il faut juste créer la base de données à la main, en faisant les commandes suivantes :
```
bash
mysql -u root -p
mot de passe : root
CREATE DATABASE books;
exit;
```
La création des tables se fera de facon dynamique grace à l'API.
