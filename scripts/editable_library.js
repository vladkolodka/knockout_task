var storage = `
    {
        "books": [
            {"id": 1, "name": "Book 1", "releaseDate": "1990-01-01", "raiting": 5, "pages": 10},
            {"id": 2, "name": "Book 2", "releaseDate": "1992-01-01", "raiting": 9, "pages": 50}
        ],
        
        "authors": [
            {"id": 1, "firstName": "John", "lastName": "Smith"},
            {"id": 2, "firstName": "Martin", "lastName": "Lloyd"}
        ]
    }
`;


(function () {
    function BookModel(data) {
        var modelMapping = {
            copy: ['id']
        };

        ko.mapping.fromJS(data, modelMapping, this);
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

    function PageViewModel(data) {
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

        ko.mapping.fromJS(data, modelMapping, this);
    }

    function Main() {
        ko.applyBindings(new PageViewModel(JSON.parse(storage)))
    }

    document.addEventListener("DOMContentLoaded", Main, false);
})();