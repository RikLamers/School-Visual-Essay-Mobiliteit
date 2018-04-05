import '../scss/main.scss';
import * as d3 from 'd3';

d3.csv('/src/data/gemiddeld_aantal_km_per_inwoner.csv', function(d,i) {
    console.log(d);
});

