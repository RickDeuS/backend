require('dotenv').config();
const passport = require('passport');
const authJWT = require('./src/libs/auth');
const { config } = require('./src/config/environment');// Variable env
// const { validatorHandler } = require('./src/middlewares/validator.handler');
passport.use(authJWT);
require('./src/config/database/mongo.connect');

const express = require('express');
const compression = require('compression');
const logger = require('./src/loaders/logger');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('./src/config/database/mongo.connect');
const dynamicForm = require('./src/routers/dynamicForm.routes');
const routerResources = require('./src/routers/resources.routes');
const routerEntity = require('./src/routers/entity.routes');
const routerServices = require('./src/routers/services.routes');
const routerChannel = require('./src/routers/channel.routes');
const routerTypeChannel = require('./src/routers/typeChannel.routes');
const routerTerms = require('./src/routers/terms.routes');
const routerContract = require('./src/routers/contract.routes');
const routerPlan = require('./src/routers/plan.routes');

const routerDni = require('./src/routers/dni.routes');
const routerAudit = require('./src/logs/database/routes');
const routerRecog = require('./src/routers/recognition.routes');
const routerMonitoreo = require('./src/routers/monitoreo.routes');
const routerSendRegister = require('./src/routers/sendregister.routes');
const routerSucursales = require('./src/routers/sucursal.routes');
const routerModulo = require('./src/routers/modulo.routes');
const routerChatbot = require('./src/routers/chatbot.routes');
const routerCode = require('./src/routers/code.router');

const routerLocalization = require('./src/routers/localization.routes');
const routerAdministrador = require('./src/routers/administrador.routes');
const routerCampospersonalizados = require('./src/routers/campospersonalizados.routes');
const routerCatalgoErrores = require('./src/routers/catalogoerrores.routes');
const routerBot = require('./src/routers/bot.routes');
const routerConfigRecursos = require('./src/routers/configrecursos.routes');
const routerDetallePlan = require('./src/routers/detalleplan.routes');
const routerIntencion = require('./src/routers/intencion.routes');
const routerMensaje = require('./src/routers/mensaje.routes');
const routerMoneda = require('./src/routers/moneda.routes');
const routerOpcionesCampo = require('./src/routers/opcionescampo.routes');
const routerPagina = require('./src/routers/pagina.routes');
const routerPerfil = require('./src/routers/perfil.routes');
const routerPlanContrato = require('./src/routers/plancontrato.routes');
const routerTiposcampos = require('./src/routers/tipocampos.routes');


const app = express();
// app.use(validatorHandler)
app.use(function (req, res) {
	console.log('en app use -----------')
	console.log(req.hostname);
	console.log(req.ip);
	// console.log(req.headers);
	// return res.status(400).send(req);
	req.next();
});


// Middleware
app.use(compression());
app.use(cors());
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb', extended: true }));

morgan.token('body', (req, res) => {
	if (req.body) {
		return JSON.stringify(req.body);
	}
	return JSON.stringify({ no: 'nooo' });
});
morgan.token('lat', (req, res) => req.headers.lat);
morgan.token('long', (req, res) => req.headers.long);
morgan.token(
	'remote-ip',
	(req, res) => req.headers['x-forwarded-for'] || req.connection.remoteAddress
);
app.use(
	morgan(
		`{"remote_addr": ":remote-addr", "remote_user": ":remote-user", 
      "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", 
      "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", 
      "user_agent": ":user-agent", "response_time": ":response-time", "body": :body, "lat": ":lat", "long": ":long",
      "reqheader": ":req[header]", "resheader": ":res[header]", "remote-ip": ":remote-ip"}`,
		{ stream: logger.stream }
	)
);

app.use(passport.initialize());

// Routers

app.use('/dynamicform', dynamicForm);
app.use('/resources', routerResources);
app.use('/entity', routerEntity);
app.use('/services_entidad', routerServices);
app.use('/channel', routerChannel);
app.use('/channel/type', routerTypeChannel);
app.use('/terms', routerTerms);
app.use('/contract', routerContract);
app.use('/plan', routerPlan);

app.use('/civil_registry', routerDni);
app.use('/recognition', routerRecog);
app.use('/export_logs', routerAudit);
app.use('/monitoreo', routerMonitoreo);
app.use('/sendregister', routerSendRegister);
app.use('/sucursal', routerSucursales);
app.use('/code', routerCode);
app.use('/modulo', routerModulo);
app.use('/api', routerChatbot);

app.use('/localization', routerLocalization);
app.use('/administrador', routerAdministrador);
app.use('/campos_personalizados', routerCampospersonalizados);
app.use('/catalogo_errores', routerCatalgoErrores);
app.use('/bot', routerBot);
app.use('/config_recursos', routerConfigRecursos);
app.use('/detalle_plan', routerDetallePlan);
app.use('/intencion', routerIntencion);
app.use('/mensaje', routerMensaje);
app.use('/moneda', routerMoneda);
app.use('/opciones_campo', routerOpcionesCampo);
app.use('/page', routerPagina);
app.use('/perfil', routerPerfil);
app.use('/plan_contrato', routerPlanContrato);
app.use('/tipo_campo', routerTiposcampos);
app.use('/plantillas', require('./src/routers/template_entidad.routes'));
app.use('/otp', require('./src/routers/otp.routes'));
app.use('/transferencias', require('./src/routers/transferencias.routes'));
app.use('/novedad_servicio', require('./src/routers/novedadServicio.routes'));
app.use('/seguimiento_novedad', require('./src/routers/seguimientoNovedad.routes'));
app.use('/reporte_novedad', require('./src/routers/reporteNovedad.routes'));
app.use('/tema', require('./src/routers/temas.routes'));
app.use('/login', routerAdministrador);
app.use('/menu', require('./src/apps/menu/routes/menu.routes'));


// error handler
app.use('/storage/uploads', express.static('static/uploads'));
// API DOCS
if (config.DEV) {
	app.use('/docs', express.static('docs'));
}

// Start server
console.log('levantamos servidor ', config.PORT, 'en host ', config.HOST);

app.listen(config.PORT, config.HOST, function (err) {
	if (err) console.log(err, "Error in server setup")
	logger.info(
		`Server listening at \x1b[36mhttp://${config.HOST}:${config.PORT}\x1b[0m`
	);
	console.log(`Server listening at \x1b[36mhttp://${config.HOST}:${config.PORT}\x1b[0m`);
	if (config.DEV) {
		logger.info(
			`[Enabled] API Documentation \x1b[36mhttp://${config.HOST}:${config.PORT}/docs\x1b[0m`
		);
		console.log(`[Enabled] API Documentation \x1b[36mhttp://${config.HOST}:${config.PORT}/docs\x1b[0m`);
	}

});
const corsOpts = {
	origin: '*',

	methods: [
		'GET',
		'POST',
	],

	allowedHeaders: [
		'Content-Type',
	],
};

app.use(cors(corsOpts));
