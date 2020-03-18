angular.module("hackaton-stefanini").controller("PerfilIncluirAlterarController", PerfilIncluirAlterarController);
PerfilIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function PerfilIncluirAlterarController(
    $rootScope,
    $scope,
    $location,
    $q,
    $filter,
    $routeParams,
    HackatonStefaniniService) {

    /**ATRIBUTOS DA TELA */
    vm = this;

    vm.perfil = {
        id: null,
        nome: "",
        descricao: "",
        dataHoraInclusao: null,
        dataHoraAlteracao: null,
    };

    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";

    /**METODOS DE INICIALIZACAO */
    vm.init = function () {

        if ($routeParams.idPerfil) {
            vm.tituloTela = "Editar Perfil";
            vm.acao = "Editar";
            vm.listar($routeParams.idPerfil);

            vm.recuperarObjetoPorIDURL($routeParams.idPerfil, vm.urlPerfil).then(
                function (perfilRetorno) {
                    if (perfilRetorno !== undefined) {
                        vm.perfil = perfilRetorno;
                        // vm.perfil.dataHoraInclusao = vm.formataDataTela(perfilRetorno.dataHoraInclusao);
                        // vm.perfil.dataHoraAlteracao = vm.formataDataTela(perfilRetorno.dataHoraAlteracao);
                    }
                }
            );
        } else {
            vm.tituloTela = "Cadastrar Perfil";
            vm.acao = "Cadastrar";
        }

    };

    /**METODOS DE TELA */
    vm.cancelar = function () {
        vm.retornarTelaListagem();
    };

    vm.retornarTelaListagem = function () {
        $location.path("listarPerfis");
    };

    vm.incluir = function () {

        var objetoDados = angular.copy(vm.perfil);
        var data = new Date;

        if (vm.acao == "Cadastrar") {
            vm.perfil.dataHoraInclusao = data;

            vm.salvar(vm.urlPerfil, objetoDados).then(
                function (perfilRetorno) {
                    vm.retornarTelaListagem();
                });
        } else if (vm.acao == "Editar") {
            vm.perfil.dataHoraAlteracao = data;

            vm.alterar(vm.urlPerfil, objetoDados).then(
                function (perfilRetorno) {
                    vm.retornarTelaListagem();
                });
        };
    }

    vm.remover = function (objeto) {

        var url = vm.urlPerfil + objeto.id;
        vm.excluir(url).then(
            function (ojetoRetorno) {
                vm.retornarTelaListagem();
            });
    }

    /**METODOS DE SERVICO */
    vm.recuperarObjetoPorIDURL = function (id, url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listarId(url + id).then(
            function (response) {
                if (response.data !== undefined)
                    deferred.resolve(response.data);
            }
        );
        return deferred.promise;
    };

    vm.listar = function (url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listar(url).then(
            function (response) {
                if (response.data !== undefined) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.salvar = function (url, objeto) {

        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.incluir(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.alterar = function (url, objeto) {
        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.alterar(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.excluir = function (url, objeto) {

        var deferred = $q.defer();
        HackatonStefaniniService.excluir(url).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    /**METODOS AUXILIARES */
    vm.formataDataJava = function (data) {
        var dia = data.slice(0, 2);
        var mes = data.slice(2, 4);
        var ano = data.slice(4, 8);
        var hora = data.slice(8, 10);
        var min = data.slice(10, 12);
        var seg = data.slice(12, 14);

        return ano + "-" + mes + "-" + dia + "T" + hora + ":" + min + ":" + seg;
    };

    vm.formataDataTela = function (data) {
        var ano = data.slice(0, 4);
        var mes = data.slice(5, 7);
        var dia = data.slice(8, 10);

        return dia + mes + ano;
    };
}