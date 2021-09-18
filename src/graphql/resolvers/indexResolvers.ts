import { ClassType, NonEmptyArray } from "type-graphql";
import { Service } from "typedi";
import { TicTacToe } from "./moduleTicToc/tictoc";



export const clasesResolver: NonEmptyArray<ClassType> = [
    TicTacToe

]