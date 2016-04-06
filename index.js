var Benchmark = require('benchmark');

var setup = function() {
  var getNamespace = function(name) {
    if (name.lastIndexOf('xml:', 0) === 0) {
      return 'http://www.w3.org/XML/1998/namespace';
    }

    if (name.lastIndexOf('xlink:', 0) === 0) {
      return 'http://www.w3.org/1999/xlink';
    }
  };

  var xlinkNS = 'http://www.w3.org/1999/xlink';
  var xmlNS = 'http://www.w3.org/XML/1998/namespace';
  var attributeNSMap = {
    'xlink:actuate': xlinkNS,
    'xlink:arcrole': xlinkNS,
    'xlink:href': xlinkNS,
    'xlink:role': xlinkNS,
    'xlink:show': xlinkNS,
    'xlink:title': xlinkNS,
    'xlink:type': xlinkNS,
    'xml:base': xmlNS,
    'xml:lang': xmlNS,
    'xml:space': xmlNS
  };

  var arr = [
    'id',
    'class',
    'aria-label',
    'data-foo',
    'data-bar',
    'superlongattribute',
    'xlink:href',
    'label',
    'title',
    'type',
    'name',
    'for',
    'data-baz'
  ];
  var namespaceCount;
};

var teardown = function() {
  if (namespaceCount !== 1) {
    throw new Error('wrong number of namespaces');
  }
}

new Benchmark.Suite()
.add('map lookup', function() {
  namespaceCount = 0;
  for (var i = 0; i < arr.length; i += 1) {
    var name = arr[i];
    var ns = attributeNSMap[name];
    if (ns) {
      namespaceCount += 1;
    }
  }
}, {
 setup: setup,
 teardown: teardown
})
.add('lastIndexOf', function() {
  namespaceCount = 0;
  for (var i = 0; i < arr.length; i += 1) {
    var name = arr[i];
    var ns = getNamespace(name);
    if (ns) {
      namespaceCount += 1;
    }
  }
}, {
 setup: setup,
 teardown: teardown
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run();
