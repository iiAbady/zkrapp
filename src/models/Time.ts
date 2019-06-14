import { Entity, PrimaryColumn } from 'typeorm';

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

@Entity('time')
export class Time {
	@PrimaryColumn({ type: 'timestamptz' })
	triggers_at!: Date;
}
