var mymap = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 9)
mymap.locate({ setView: true, maxZoom: 17 })

var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(mymap)

// en el clusters almaceno todos los markers
var group = L.markerClusterGroup()
var data_markers = []
var data_all

function onMapLoad () {
  console.log('Mapa cargado')
  $.getJSON('http://localhost/mapa/api/apiRestaurants.php', function (data) {
    data_all = data
	var mappedKindFood1 = data.map(function (restaurant) { return restaurant.kind_food.split(',') })
					.flat()
					.sort()
    var mappedFood = mappedKindFood1.filter((a, i) => a !== mappedKindFood1[i - 1])
      .concat(['all'])
      .map((restaurant) => '<option>' + restaurant + '</option>').reduce((a, b) => a + b)

    console.log(mappedFood)
    $('#kind_food_selector').html(mappedFood)

    data.map(function (restaurant) {
      var marker = L.marker([restaurant.lat, restaurant.lng])
      data_markers.push(marker)
      console.log(data_markers)
    })
  })

  // FASE 3.1
  // 1) Relleno el data_markers con una petición a la api
  // 2) Añado de forma dinámica en el select los posibles tipos de restaurantes
  // 3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
}

$('#kind_food_selector').on('change', function () {
  console.log(this.value)
  mymap.removeLayer(group)
  group.removeLayers(group.getLayers())

  render_to_map(data_markers, this.value)
})

function render_to_map (data_markers, filter) {
  if (filter === 'all') {
    group.addLayers(data_markers)
  } else {
    data_all.map(function (x, i) {
      if (x.kind_food.includes(filter, 0)) {
        group.addLayers(data_markers[i])
      }
    })
  }
  mymap.addLayer(group)

  // data_markers.map(function(x){

  // if (x.kind_food.includes(filter,0)){
  // x.addTo(mymap)
  // }

  // })

  /*
FASE 3.2
	1) Limpio todos los marcadores
	2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
*/
}
