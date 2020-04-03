import axios from "axios";

export default axios.create({
    baseURL: "https://tictactoe-task-abs.herokuapp.com"
});