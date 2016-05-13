Ext.require([
  'Ext.grid.*',
  'Ext.data.*',
  'Ext.panel.*',
  'Ext.layout.container.Border'
]);

Ext.onReady(function(){
  
  //Model
  Ext.define('Sequences',{
    extend: 'Ext.data.Model',
    proxy: {
      type: 'ajax',
      reader: 'json'
    },
    fields: [
      {name: 'name', type: 'string'},
      {name: 'sequence', type: 'string', convert: function(sequence) {
        return sequence && sequence.trim().length ? 'DNA' : '';
      }},
      {name: 'size', type: 'int'},
      {name: 'features', type: 'string', convert: function(features) {
        var arr = [];
        features.forEach(function(feature) {
          arr.push(feature.name);
        });
        return arr.join(', ');
      }},
      {name: 'dateCreated', type: 'string'},  
      {name: 'dateModified', type: 'string'}  
    ]
  });

  //Data Store
  var store = Ext.create('Ext.data.Store', {
    model: 'Sequences',
    proxy: {
      type: 'ajax',
      url: 'http://tg-server.herokuapp.com/sequences',
      reader: {
        type: 'json',
        root: 'sequences',
        totalProperty  : 'total'
      }
    }
  });

  //Grid
  var grid = Ext.create('Ext.grid.Panel', {
    bufferedRenderer: false,
    store: store,
    columns: [
      {text: "Name", width: 120, dataIndex: 'name', sortable: true},
      {text: "Type", width: 80, dataIndex: 'sequence', sortable: true},
      {text: "Size (bp)", width: 80, dataIndex: 'size', sortable: true},
      {text: "Features", flex: 1, dataIndex: 'features', sortable: true},
      {text: "Date Created", width: 125, dataIndex: 'dateCreated', 
        sortable: true, renderer: Ext.util.Format.dateRenderer('F d, Y h:i A')},
      {text: "Last Modified", width: 125, dataIndex: 'dateModified', 
        sortable: true, renderer: Ext.util.Format.dateRenderer('F d, Y h:i A')} 
    ],
    forceFit: true,
    height:600,
    region: 'north'
  });

  Ext.create('Ext.Panel', {
    renderTo: 'grid',
    frame: true,
    title: 'Grid using Heroku Hosted Endpoint',
    width: 1280,
    height: 600,
    layout: 'border',
    items: [grid]
  });

  store.load();
});