

(function () {

    function Storage(){
        this.initData = `
            {
                "books": [
                    {"id": 1, "name": "Book 1", "releaseDate": "1990-01-01", "raiting": 5, "pages": 10, "authors": [ 1 ]},
                    {"id": 2, "name": "Book 2", "releaseDate": "1992-01-01", "raiting": 9, "pages": 50, "authors": [ 2 ]}
                ],
                
                "authors": [
                    {"id": 1, "firstName": "John", "lastName": "Smith"},
                    {"id": 2, "firstName": "Martin", "lastName": "Lloyd"}
                ]
            }
        `;
    }

    Storage.prototype.load = function(){
        return JSON.parse(localStorage.getItem('data') || this.initData);
    }

    Storage.prototype.save = function(data){
        return localStorage.setItem('data', data);
    }
    
    function BookModel(data) {
        var modelMapping = {
            copy: ['id']
        };

        ko.mapping.fromJS(data, modelMapping, this);

        this.dirtyFlag = new ko.dirtyFlag(this, false);
    }

    function AuthorModel(data) {
        var modelMapping = {
            copy: ['id', 'firstName', 'lastName']
        };

        this.name = ko.computed(function () {
            return this.firstName + ' ' + this.lastName;
        }, this);

        ko.mapping.fromJS(data, modelMapping, this);
    }

    AuthorModel.prototype.toJSON = function() {
        var copy = ko.toJS(this); //easy way to get a clean copy
        delete copy.name; //remove an extra property
        return copy; //return the copy to be serialized
    }

    function PageViewModel(data, saveCallback) {
        var self = this;

        var modelMapping = {
            books: {
                key: function (obj) {
                    return obj.id;
                },
                create: function (options) {
                    return new BookModel(options.data);
                }
            },
            authors: {
                key: function (obj) {
                    return obj.id;
                },
                create: function (options) {
                    return new AuthorModel(options.data);
                }
            }
        };

        this.save = function(book) {           
            var data = ko.toJSON(self, function(key, value){
                if(key === '__ko_mapping__'){
                    return undefined;
                }

                return value;
            });

            saveCallback(data);

            book.dirtyFlag.reset();
        }

        ko.mapping.fromJS(data, modelMapping, this);
    }

    function Main() {
        var storage = new Storage();

        ko.applyBindings(new PageViewModel(storage.load(), storage.save))
    }

    document.addEventListener("DOMContentLoaded", Main, false);
})();