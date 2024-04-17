import Tile from '../Tile/Tile';
import './Board.css';
import { useRef, useState } from 'react';
import Referee from '../../referee/Referee';

const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export interface Piece {
	image: string;
	x: number;
	y: number;
	type: PieceType;
	team: TeamType;
}

export enum PieceType {
	PAWN,
	ROOK,
	KNIGHT,
	BISHOP,
	QUEEN,
	KING
}

export enum TeamType {
	OPPONENT,
	OUR
}

const initialState: Piece[] = []

for (let i = 0; i < 8; i++)
	initialState.push({ image: 'assets/images/pawn_b.png', x: i, y: 6, type: PieceType.PAWN, team: TeamType.OPPONENT })

for (let i = 0; i < 8; i++)
	initialState.push({ image: 'assets/images/pawn_w.png', x: i, y: 1, type: PieceType.PAWN, team: TeamType.OUR })

for (let p = 0; p < 2; p++) {
	const team = p === 0 ? TeamType.OPPONENT : TeamType.OUR;
	const color = p === 0 ? 'b' : 'w';
	const y = p === 0 ? 7 : 0;

	initialState.push({ image: `assets/images/rook_${color}.png`, x: 0, y, type: PieceType.ROOK, team })
	initialState.push({ image: `assets/images/rook_${color}.png`, x: 7, y, type: PieceType.ROOK, team })
	initialState.push({ image: `assets/images/knight_${color}.png`, x: 1, y, type: PieceType.KNIGHT, team })
	initialState.push({ image: `assets/images/knight_${color}.png`, x: 6, y, type: PieceType.KNIGHT, team })
	initialState.push({ image: `assets/images/bishop_${color}.png`, x: 2, y, type: PieceType.BISHOP, team })
	initialState.push({ image: `assets/images/bishop_${color}.png`, x: 5, y, type: PieceType.BISHOP, team })
	initialState.push({ image: `assets/images/queen_${color}.png`, x: 3, y, type: PieceType.QUEEN, team })
	initialState.push({ image: `assets/images/king_${color}.png`, x: 4, y, type: PieceType.KING, team })
}

export default function Board() {
	const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
	const [gridX, setGridX] = useState(0)
	const [gridY, setGridY] = useState(0)
	const [pieces, setPieces] = useState<Piece[]>(initialState)
	const boardRef = useRef<HTMLDivElement>(null);
	let board = [];
	const referee = new Referee();

	function grabPiece(e: React.MouseEvent) {
		const element = e.target as HTMLElement;
		const chessboard = boardRef.current;

		// Only grab pieces, not empty tiles
		if (element.classList.contains("chess-piece") && chessboard) {

			setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
			setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)));
			const x = e.clientX - 50;
			const y = e.clientY - 50;
			element.style.position = "absolute";
			element.style.left = `${x}px`;
			element.style.top = `${y}px`;

			setActivePiece(element);
		}
	}

	function movePiece(e: React.MouseEvent) {
		const chessboard = boardRef.current;
		if (activePiece && chessboard) {
			//Get the edges of the board
			const minX = chessboard.offsetLeft - 25;
			const minY = chessboard.offsetTop - 25;
			const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
			const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;

			const x = e.clientX - 50;
			const y = e.clientY - 50;
			activePiece.style.position = "absolute";

			// Keep the piece in bounds of the chessboard
			if (x < minX)
				activePiece.style.left = `${minX}px`
			else if (x > maxX)
				activePiece.style.left = `${maxX}px`
			else
				activePiece.style.left = `${x}px`

			if (y < minY)
				activePiece.style.top = `${minY}px`
			else if (y > maxY)
				activePiece.style.top = `${maxY}px`
			else
				activePiece.style.top = `${y}px`
		}

	}

	function dropPiece(e: React.MouseEvent) {
		// Let go of the piece on Mouse Up
		const chessboard = boardRef.current;
		if (activePiece && chessboard) {
			const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
			const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

			// Update the piece position
			setPieces(value => {
				const pieces = value.map(p => {
					if (p.x === gridX && p.y === gridY) {
						const validMove = referee.isValidMove(gridX, gridY, x, y, p.type, p.team, value);
						if (validMove) {
							p.x = x;
							p.y = y;
						}
						else {
							activePiece.style.position = 'relative';
							activePiece.style.removeProperty('top');
							activePiece.style.removeProperty('left');
						}
					}
					return p;
				})
				return pieces;
			})
		}
		setActivePiece(null);
	}

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
			ref={boardRef}
			id='board'>{board}</div>
	);
}