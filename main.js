const yargs = require('yargs')
const http = require('http')
const fs = require('fs')
const Jimp = require('jimp')
const url = require('url')
const port = 3000;

//1. El servidor debe ser levantado por instrucción de una aplicación Node que use el

const key = 123
const argv = yargs
    .command(
        'acceso',
        'Comando para el desafio Black and White',
        {
            key: {
                describe: 'Contraseña',
                demand: true,
                alias: 'k',
            },
        },
        (args) => {
            args.key == key
                ?
                http
                    .createServer((req, res) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' })
                        
                        // 2. Requerimiento: El servidor debe disponibilizar una ruta raíz que devuelva un HTML con el formulario
                        // para el ingreso de la URL de la imagen a tratar
                        if (req.url == '/') {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            fs.readFile('index.html', 'utf8', (err, html) => {
                                res.end(html)
                            })
                        }
            
                        //3. Requerimiento: Los estilos de este HTML deben ser definidos por un archivo CSS alojado en el servidor.
                        if (req.url == '/estilos') {
                            res.writeHead(200, { 'Content-Type': 'text/css' })
                            fs.readFile(__dirname+'/assets/css/style.css', (err, css) => {
                                res.end(css)
                            })
                        }

                        //4. Requerimiento:  El formulario debe redirigir a otra ruta del servidor que deberá procesar la imagen
                        if (req.url.includes('/imagen')) {
                            const params = url.parse(req.url, true).query;
                            const nombre = params.nombre;
                            Jimp.read(nombre, (err, imagen) => {
                                imagen
                                    .resize(350, Jimp.AUTO)
                                    .quality(60)
                                    .greyscale()
                                    .writeAsync('newImg.jpg')
                                    .then(() => {
                                        fs.readFile('newImg.jpg', (err, Imagen) => {
                                            res.writeHead(200, { 'Content-Type': 'image/jpeg' })
                                            res.end(Imagen)
                                        })
                                    })
                            })
                        }
                    }).listen(port, () => console.log(`Escuchando el puerto ${port}`))
                    :console.log('Credenciales incorrectas, intente nuevamente')
        }
    )
    .help().argv