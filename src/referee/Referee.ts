import { PieceType, TeamType, Piece } from "../components/Board/Board";

export default class Referee {
	tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
		console.log("Checking if occupied...");

		const piece = boardState.find(p => p.x === x && p.y === y)
		if (piece)
			return true;
		return false;
	}

	isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]) {
		console.log("Referee is checking the move.");

		// Pawn
		if (type === PieceType.PAWN) {
			const specialRow = team === TeamType.OUR ? 1 : 6;
			const pawnDirection = team === TeamType.OUR ? 1 : -1;

			// For the starting row
			if (px === x && py === specialRow && y - py === 2 * pawnDirection) {
				if (!this.tileIsOccupied(x, y, boardState) && !this.tileIsOccupied(x, y - pawnDirection, boardState)) {
					return true;
				}
			}
			// After Pawn's first move
			else if (px === x && y - py === pawnDirection) {
				if (!this.tileIsOccupied(x, y, boardState)) {
					return true;
				}
			}
		}

		return false;
	}
}