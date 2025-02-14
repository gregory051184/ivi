import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Film} from "../films/films.model";
import {ApiProperty} from "@nestjs/swagger";


interface ReviewCreationAttrs {
    title: string,
    text: string,
}

@Table({tableName: 'reviews'})
export class Review extends Model<Review, ReviewCreationAttrs> {
    //@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    @ApiProperty({example: 'jhgfjg-fjeij-flks-948548kfk', description: "Уникальный идентификатор"})
    @Column({type:DataType.STRING, unique: true, primaryKey:true})
    id: string;

    @ApiProperty({example: "Топ коммент", description: "Заголовок комментария"})
    @Column({type: DataType.STRING})
    title: string;

    @ApiProperty({example: "Мне понравился фильм.", description: "Текст комментария"})
    @Column({type: DataType.TEXT})
    text: string;

    @ApiProperty({example: 36, description: "Рейтинг комментария"})
    @Column({type: DataType.INTEGER, defaultValue: 36})
    rating: number;

    // @BelongsTo(() => User)
    // user: string

    @ApiProperty({example: 1, description: "Уникальный идентификатор пользователя"})
    @Column({type: DataType.INTEGER})
    userId: number;

    @ApiProperty({example: 1, description: "Уникальный идентификатор фильма"})
    @ForeignKey(() => Film)
    @Column({type: DataType.INTEGER})
    filmId: number;

    @ApiProperty({example: {}, description: "Уникальный идентификатор родительского комментария"})
    @BelongsTo(() => Film)
    film: string

    @ApiProperty({example: null, description: "Уникальный идентификатор родительского комментария"})
    @ForeignKey(() => Review)
    @Column({type: DataType.STRING})
    parentId: string;

    @ApiProperty({example: {}, description: "Уникальный идентификатор родительского комментария"})
    @BelongsTo(() => Review, 'parentId')
    parent: string
}