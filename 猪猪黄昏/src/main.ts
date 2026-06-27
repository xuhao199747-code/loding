import Phaser from "phaser";

import { createGameConfig } from "./game/config/gameConfig";
import "./styles.css";

new Phaser.Game(createGameConfig());
