describe("search in dummy scope", function() {
    var simpleScope = {
        test2: '3',
        test3: 'this is a test',
    };
    it('can find all occurences of tests', function() {
        var s = new ScopeSearch(simpleScope, function(data){return data.indexOf('test') > -1;});
        var results = s.search();
        expect(results.length).toBe(3);
    });
});
