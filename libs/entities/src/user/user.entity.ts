import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Entity('user')
export class UserEntity {
  @ApiProperty({ type: Number })
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @Column('varchar', { nullable: true })
  name?: string;

  @ApiProperty({ type: String })
  @IsEmail()
  @Column('varchar', { unique: true })
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { select: false })
  password: string;

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
