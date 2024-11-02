import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Position {
  x: number;
  y: number;
}

interface Obstacle {
  x: number;
  y: number;
  direction: 'left' | 'right';
  speed: number;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  player: Position = { x: 5, y: 9 };
  obstacles: Obstacle[] = [];
  gameOver = false;
  score = 0;
  gridSize = 10;
  private gameInterval: any;
  private initialY = 9;
  private highestY = 9;

  ngOnInit() {
    this.initializeObstacles();
    this.startGame();
    this.highestY = this.initialY;
    this.score = 0;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (this.gameOver) return;

    switch (event.key) {
      case 'ArrowUp':
        if (this.player.y > 0) {
          this.player.y--;
          if (this.player.y < this.highestY) {
            this.highestY = this.player.y;
            this.score = this.initialY - this.highestY;
          }
        }
        break;
      case 'ArrowDown':
        if (this.player.y < this.gridSize - 1) this.player.y++;
        break;
      case 'ArrowLeft':
        if (this.player.x > 0) this.player.x--;
        break;
      case 'ArrowRight':
        if (this.player.x < this.gridSize - 1) this.player.x++;
        break;
    }
  }

  private initializeObstacles() {
    for (let i = 1; i < this.gridSize - 1; i += 2) {
      this.obstacles.push({
        x: Math.floor(Math.random() * this.gridSize),
        y: i,
        direction: i % 4 === 1 ? 'left' : 'right',
        speed: Math.random() * 0.3 + 0.1,
      });
    }
  }

  private startGame() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
    
    this.gameInterval = setInterval(() => {
      if (this.gameOver) return;
      
      this.moveObstacles();
      this.checkCollision();
    }, 100);
  }

  restartGame() {
    this.player = { x: 5, y: this.initialY };
    this.obstacles = [];
    this.gameOver = false;
    this.highestY = this.initialY;
    this.score = 0;
    this.initializeObstacles();
    this.startGame();
  }

  private moveObstacles() {
    this.obstacles.forEach(obstacle => {
      if (obstacle.direction === 'left') {
        obstacle.x -= obstacle.speed;
        if (obstacle.x < 0) obstacle.x = this.gridSize - 1;
      } else {
        obstacle.x += obstacle.speed;
        if (obstacle.x >= this.gridSize) obstacle.x = 0;
      }
    });
  }

  private checkCollision() {
    this.obstacles.forEach(obstacle => {
      if (
        Math.abs(this.player.x - obstacle.x) < 1 &&
        Math.abs(this.player.y - obstacle.y) < 1
      ) {
        this.gameOver = true;
      }
    });
  }

  isObstaclePresent(x: number, y: number): boolean {
    return this.obstacles.some(o => Math.floor(o.x) === x && o.y === y);
  }
} 