import { Entity, Column, PrimaryColumn, Index, CreateDateColumn } from 'typeorm';

@Entity('azkar')
export class Azkar {
	@PrimaryColumn({ length: 247 })
	public content!: string;

	@Column({ 'default': 0 })
	public sends!: number;

	@Column({ type: 'timestamptz', nullable: true })
	public last_sent!: Date;

	@CreateDateColumn()
	public createdAt!: Date;

    @Index()
    @Column({ 'default': false })
	public approved!: boolean;
}
