import { svg } from "./element"
//todo debug layout
import data from "./$-data"

const {max} = Math;
const WIDTH = 150;
const BAR_WIDTH = 22;
const HEIGHT = 115;
const BASE_FONT_SIZE = 2.5;
const PADDING_LEFT = 6;
const PADDING_RIGHT = 2;
const PADDING_TOP = 3;

const cachedcolors = {
	"Done": "#FFC000",
	"In Progress": "#A5A5A5",
	"Open": "#ED7D31",
};
function getSpeciesColor( label ) {
	if(!cachedcolors[label]) {
		cachedcolors[label] =
			`rgb(${Math.random()*256|0},${Math.random()*256},${Math.random()*256|0})`;
	}
	return cachedcolors[label];
}

class Bar {
	
	constructor( model, { start } ) {
		this.gr = svg( "g", {},
			svg("rect", {
				style: {
					fill: getSpeciesColor( model.species ),
				},
				y: PADDING_TOP + (1 - start - model.freq) * 100,
				width: BAR_WIDTH,
				height: model.freq * 100,
			}),
		);
		model.freq > 0.05 && this.gr.append( svg( "text", {
			x: BAR_WIDTH / 2,
			y: PADDING_TOP + (model.freq / 2 + 1 - start - model.freq) * 100,
			style: {
				alignmentBaseline: "middle",
				fontSize: `${BASE_FONT_SIZE}px`,
				textAnchor: "middle",
				fill: "#000",
			},
			text: `${model.vl}`,
		} ) );
	}
	
}

class Axis {
	
	constructor({ height, width, ratio = 0.2 }) {
		const count = 9;
		this.gr = svg( "g", {},
			...[].concat(...new Array(count).fill(0).map( ( _, i ) => {
				return [
					svg("line", {
						style: {
							stroke: "#D6D6D6",
							strokeWidth: ratio,
						},
						x1: PADDING_LEFT,
						x2: WIDTH - PADDING_RIGHT,
						y1: PADDING_TOP + (1 - i / (count-1)) * 100,
						y2: PADDING_TOP + (1 - i / (count-1)) * 100,
					}),
					svg( "text", {
						style: {
							fontSize: `${BASE_FONT_SIZE}px`,
							textAnchor: "end",
							fill: "#6B6B6B",
						},
						x: 4,
						y: PADDING_TOP + (1 - i / (count-1)) * 100 + 0.5,
						text: `${i*2}`
					}),
				]
			})),
		);
	}
	
}

class Unit  {
	
	constructor({ margin }) {
		this.margin = margin;
	}
	
	justifyNodes() {
		[...this.gr.children].reduce( (dx, node, i) => {
			const { width } = node.getBBox();
			node.style.transform =
				`translateX( ${ dx + i * this.margin.sx + (i/2|0) * this.margin.wx }px )`;
			return dx + width;
		}, 0);
	}
	
}

class Legend extends Unit {
	
	constructor( model ) {
		super( { margin: { sx: 0.3, wx: 2 } } );
		this.gr = svg( "g", { } );
		this.gr.append( ...[].concat(...model.chapters.map( ({ species }) => [
			svg( "rect", {
				x: 0, y: -1, width: 1.5, height: 1.5,
				style: { fill: getSpeciesColor( species ) }
			} ),
			svg("g", {},
				svg( "text", {
					style: {
						alignmentBaseline: "middle",
						fontSize: `${BASE_FONT_SIZE}px`,
						fill: "#6B6B6B",
					}, text: species
				})
			),
		] ) ));
	}
	
	justifyNodes() {
		super.justifyNodes();
		const { width } = this.gr.getBBox();
		this.gr.style.transform =
			`translate( ${ (PADDING_LEFT + WIDTH - width - PADDING_RIGHT) / 2 }px, ${HEIGHT-6}px )`
	}
	
}


class Stage {
	
	constructor(model, { species, count }) {
		const width = WIDTH - PADDING_LEFT - PADDING_RIGHT;
		const margin = width / (count*2);
		
		this.gr = svg( "g", { style: {
				transform: `translateX(${ PADDING_LEFT + margin * (species*2+1) - BAR_WIDTH/2}px)`}
		} );
		const height = model.chapters.reduce( (start, chapter, species) => {
			this.gr.append(new Bar(chapter, { start, species }).gr);
			return start + chapter.freq;
		}, 0);
		this.gr.append(
			this.kvalue = svg( "text", {
				style: {
					fontSize: `${BASE_FONT_SIZE}px`,
					textAnchor: "middle",
					fill: "#000",
				},
				x: BAR_WIDTH / 2,
				y: PADDING_TOP + (1 - height) * 100 - 1,
				text: `${model.vl}`
			} ),
			this.keyword = svg( "text", {
				style: {
					fontSize: `${BASE_FONT_SIZE}px`,
					textAnchor: "middle",
					fill: "#000",
				},
				x: BAR_WIDTH / 2,
				y: PADDING_TOP + HEIGHT - 12,
				text: `${model.stage}`
			} ),
		);
	}
	
}

class Chart {
	
	constructor( model ) {
		this.gr = svg( "g", {},
			new Axis({ height: 100, width: 100 }).gr,
			(this.legend = new Legend( model[0] )).gr,
		);
		model.map( (stage, species, { length: count }) => {
			this.gr.append( new Stage( stage, { species, count } ).gr );
		} );
	}
	
	
}

function transform(data) {
	let maxFreq =
		max(...data.map( ({ chapters }) => chapters.reduce( (acc, { vl }) => acc+vl, 0) ));
	maxFreq += maxFreq * 0.15|0;
	return data.map( ({chapters, ...args}) => ({
		chapters: chapters.map( ({ vl, ...args }) => ({ vl, ...args, freq: vl/maxFreq }) ),
		...args,
	}));
}

export default function paint( node, layout ) {
	
	//todo debug layout
	layout = transform(data);
	
	const container = svg("g");
	
	node.append(svg( "svg", {
			style: {
				outline: "1px solid #D6D6D6",
				fontFamily: "Calibri Light",
				height: `${node.offsetHeight||innerHeight}px`,
			}, viewBox: `0 0 ${WIDTH} ${HEIGHT}`
		},
		container,
	));
	
	const chart = new Chart( layout );
	
	container.append( chart.gr );
	chart.legend.justifyNodes();

}