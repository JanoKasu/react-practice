import { act } from 'react-dom/test-utils';
import Tile from '../Tile/Tile';
import './Board.css';

const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

interface Piece {
	image: string;
	x: number;
	y: number;

}

const pieces: Piece[] = []
for (let i = 0; i < 8; i++)
	pieces.push({ image: 'assets/images/pawn_b.png', x: i, y: 6 })

for (let i = 0; i < 8; i++)
	pieces.push({ image: 'assets/images/pawn_w.png', x: i, y: 1 })

for (let p = 0; p < 2; p++) {
	const color = p === 0 ? 'b' : 'w';
	const y = p === 0 ? 7 : 0;

	pieces.push({ image: `assets/images/rook_${color}.png`, x: 0, y })
	pieces.push({ image: `assets/images/rook_${color}.png`, x: 7, y })
	pieces.push({ image: `assets/images/knight_${color}.png`, x: 1, y })
	pieces.push({ image: `assets/images/knight_${color}.png`, x: 6, y })
	pieces.push({ image: `assets/images/bishop_${color}.png`, x: 2, y })
	pieces.push({ image: `assets/images/bishop_${color}.png`, x: 5, y })
	pieces.push({ image: `assets/images/queen_${color}.png`, x: 3, y })
	pieces.push({ image: `assets/images/king_${color}.png`, x: 4, y })
}

let activePiece: HTMLElement | null = null;

function grabPiece(e: React.MouseEvent) {
	const element = e.target as HTMLElement;
	if (element.classList.contains("chess-piece")) {
		const x = e.clientX -50;
		const y = e.clientY -50;
		element.style.position = "absolute";
		element.style.left = `${x}px`;
		element.style.top = `${y}px`;

		activePiece = element;
	}
}

function movePiece(e: React.MouseEvent) {
	if (activePiece) {
		const x = e.clientX -50;
		const y = e.clientY -50;
		activePiece.style.position = "absolute";
		activePiece.style.left = `${x}px`;
		activePiece.style.top = `${y}px`;
	}
}

function dropPiece(e: React.MouseEvent) {
	if (activePiece)
		activePiece = null;
}

export default function Board() {
	let board = [];

	for (let i = ranks.length - 1; i >= 0; i--) {
		for (let j = 0; j < files.length; j++) {
			let image = '';

			pieces.forEach(p => {
				if (p.x === j && p.y === i)
					image = p.image;
			})

			board.push(<Tile key={`${i}, ${j}`} number={i + j} image={image} />);
		}
	}

	return (
		<div
		onMouseMove={e => movePiece(e)}
		onMouseDown={e => grabPiece(e)}
		onMouseUp={e => dropPiece(e)}
		id='board'>{board}</div>
	);
}