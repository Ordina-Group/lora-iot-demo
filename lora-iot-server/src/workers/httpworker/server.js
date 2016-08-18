var Server = function() {
    var logger  = require("./../../logging/logger").makeLogger("SERVER---------");
    var http    = require("http");
    var cluster = require("cluster");
    var Router  = require("./router");

    //Configuration.
    var Config  = require("../../../resources/config");
    var config  = new Config();

    //Private variables.
    var id      = null;
    var router  = null;

    init();

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    /**
     * Configures and starts the Server instance.
     * First a new Router instance will be made for handling all incoming requests.
     * The router will be given an object that contains the REST endpoint mappings.
     *
     * The server will then be set to listen on the given port and each request will be handled by the router.
     */
    function init() {
        id = cluster.worker.id;

        //Create a new router instance and pass it the mapped endpoints.
        router = new Router(mapRestEndpoints());

        var port = config.settings.httpPort;
        //Create a http server that listens on the given port. the second param is for making the localhost loopback work.
        http.createServer(onRequest).listen(port, "0.0.0.0");
        logger.INFO("Server started => Listening at port: " + port);
    }

    /**
     * Set up any REST endpoints here!
     * Add a new line for each endpoint you want to handle.
     * To allow for params to be passed, end your endpoint with "*".
     * Pass the parameter names via the params variable.
     */
    function mapRestEndpoints() {
        var GenericEndpoints    = require("./../../services/genericendpoints");
        var RegisterService     = require("./../../services/datalogging/registerService");
        var Proximus            = require("./../../services/lora/proximus");
        var Jax                 = require("./../../services/lora/jax");

        var genericEndpoints    = new GenericEndpoints();
        var registerService     = new RegisterService();
        var proximus            = new Proximus();
        var jax                 = new Jax();
        return {
            "/"                             : {execute : genericEndpoints.index,                       params: null},
            "/slotmachine"                  : {execute : genericEndpoints.slotmachine,                 params: null},
            "/booze"                        : {execute : genericEndpoints.booze,                       params: null},
            "/upload"                       : {execute : genericEndpoints.upload,                      params: null},

            "/register"                     : {execute : registerService.register,                     params: null},

            "/pxm/devices"                  : {execute : proximus.devices,                             params: null},
            "/pxm/buttonTrigger"            : {execute : proximus.buttonTrigger,                       params: null},
            "/pxm/buttonTrigger/*"          : {execute : proximus.buttonTrigger,                       params: null},
            "/pxm/levelTrigger"             : {execute : proximus.levelTrigger,                        params: null},
            "/pxm/levelTrigger/*"           : {execute : proximus.levelTrigger,                        params: null},
            "/booze/levelFull"              : {execute : proximus.levelFull,                           params: null},
            "/booze/levelHigh"              : {execute : proximus.levelHigh,                           params: null},
            "/booze/levelMedium"            : {execute : proximus.levelMedium,                         params: null},
            "/booze/levelLow"               : {execute : proximus.levelLow,                            params: null},
            "/booze/levelEmpty"             : {execute : proximus.levelEmpty,                          params: null},

            "/jax/endpoint"                 : {execute : jax.endpoint,                                 params: null}
        };
    }

    /**
     * Handles any incoming requests.
     * Any request recieved will be passed on to the router.x
     *
     * @param request The request that was received.
     * @param response The response to send back.
     */
    function onRequest(request, response) {
        var url = require("url");

        var pathName = url.parse(request.url).pathname;
        logger.INFO("IP: " + request.connection.remoteAddress + " \tassigned to server: " + id + "\t-> requested: " + pathName);
        router.route(pathName, request, response);
    }
};

module.exports = Server;