# Prueba Backend para puesto Desarrollador Node Mid (Nest Js)

### Instalaciones

Se recomienda tener instalado

- Node
- Git
- CLI Nest
- Mongo
- Docker desktop

Para visualizar mis datos alojados en la DB de Mongo uso `Table Plus`

### Pasos para poner a funcionar el proyecto

- Descargar o clonar el repositorio
- Instalar las dependencias usando `npm install`
- Ejecutar el domando `docker compose up -d` para iniciar los servicios definidos en el **docker-compose.yml**

**Nota:** Puede que al momento de ejecutar el comando anterior, todo se ejecute pero pro alguna razon no inicie el servicio. Se recomienda ir a `Docker Desktop` e iniciarlo manual, o cualquier otra herramienta que se use para visualizar los contenedores y demas informacion necesaria

- Renombrar el archivo **.env.template** a **.env**
- Luego se ejecuta el proyecto usando `npm run start:dev`

**Nota**: Hay un fichero llamado **Astronauta.postman_collection.json**, el cual es la coleccion de los metedos a las API correspondientes. Tambien puede hacer uso de estas, importandolas a la herrmienta de **Postman**

- Para poder ver la configuracion de **Swagger** una vez la aplicacion este inicializada, se recomienda ingresar a esta ruta `http://localhost:3000/api#/`

### A probar la aplicacion!!!
