import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@Entity('post')
export class PostEntity {
  @ApiProperty({ type: Number })
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ApiProperty({ type: UserEntity })
  @Type(() => UserEntity)
  @ValidateNested()
  @ManyToOne(() => UserEntity, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Column('varchar')
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Column('text')
  content: string;

  @ApiProperty({ type: String })
  @IsDateString()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @ApiProperty({ type: String })
  @IsDateString()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
