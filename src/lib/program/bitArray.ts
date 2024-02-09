import * as anchor from "@coral-xyz/anchor";

export class BitArray {
    tickets: Array<bigint>;
    amount: number;
    MAX_TICKETS: number = 5000;
    BITARRAY_BITS: number = 64;
    BPS_MUL_VALUE: bigint = BigInt(10000);
    MAX_REWARDS: number = 3;
  
    constructor(amount: number, tickets: Array<anchor.BN>) {
      this.tickets = tickets.map((ticket) => BigInt(ticket.toString()));
      this.amount = amount;
    }
  
    init() {
      this.amount = 0;
      // Assuming MAX_TICKETS and BITARRAY_BITS are defined elsewhere
      this.tickets = new Array(this.MAX_TICKETS / this.BITARRAY_BITS + 1).fill(
        0n
      );
    }
  
    checkTicket(i: number): bigint {
      const r = BigInt(((i - 1) & (this.BITARRAY_BITS - 1)) + 1);
      return (
        (this.tickets[Math.floor(i / this.BITARRAY_BITS)] /
          (1n << (BigInt(this.BITARRAY_BITS) - r))) &
        1n
      );
    }
  
    setTicket(i: number) {
      const r = ((i - 1) & (this.BITARRAY_BITS - 1)) + 1;
      if (
        ((this.tickets[Math.floor(i / this.BITARRAY_BITS)] /
          (1n << BigInt(this.BITARRAY_BITS - r))) &
          1n) ===
        0n
      ) {
        this.tickets[Math.floor(i / this.BITARRAY_BITS)] +=
          1n << BigInt(this.BITARRAY_BITS - r);
      }
    }
  
    acquireTickets(firstTicket: number, lastTicket: number) {
      console.log(`AMOUNT ${lastTicket - firstTicket + 1}`);
      this.amount += lastTicket - firstTicket + 1;
      for (let i = firstTicket; i <= lastTicket; i++) {
        this.setTicket(i);
      }
    }
  }