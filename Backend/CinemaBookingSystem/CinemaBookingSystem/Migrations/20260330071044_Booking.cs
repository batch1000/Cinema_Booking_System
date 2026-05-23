using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CinemaBookingSystem.Migrations
{
    public partial class Booking : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Booking",
                columns: table => new
                {
                    BookingID = table.Column<Guid>(nullable: false),
                    TotalPrice = table.Column<int>(nullable: false),
                    Status = table.Column<string>(maxLength: 50, nullable: false),
                    CreateAt = table.Column<DateTime>(nullable: false),
                    UserID = table.Column<Guid>(nullable: false),
                    ShowTimeID = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Booking", x => x.BookingID);
                    table.ForeignKey(
                        name: "FK_Booking_ShowTime_ShowTimeID",
                        column: x => x.ShowTimeID,
                        principalTable: "ShowTime",
                        principalColumn: "ShowTimeID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Booking_User_UserID",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SeatHolding",
                columns: table => new
                {
                    SeatHoldingID = table.Column<Guid>(nullable: false),
                    UserID = table.Column<Guid>(nullable: false),
                    ShowTimeID = table.Column<Guid>(nullable: false),
                    SeatID = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeatHolding", x => x.SeatHoldingID);
                    table.ForeignKey(
                        name: "FK_SeatHolding_Seat_SeatID",
                        column: x => x.SeatID,
                        principalTable: "Seat",
                        principalColumn: "SeatID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SeatHolding_ShowTime_ShowTimeID",
                        column: x => x.ShowTimeID,
                        principalTable: "ShowTime",
                        principalColumn: "ShowTimeID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SeatHolding_User_UserID",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookingSeat",
                columns: table => new
                {
                    BookingSeatID = table.Column<Guid>(nullable: false),
                    BookingID = table.Column<Guid>(nullable: false),
                    SeatID = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingSeat", x => x.BookingSeatID);
                    table.ForeignKey(
                        name: "FK_BookingSeat_Booking_BookingID",
                        column: x => x.BookingID,
                        principalTable: "Booking",
                        principalColumn: "BookingID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BookingSeat_Seat_SeatID",
                        column: x => x.SeatID,
                        principalTable: "Seat",
                        principalColumn: "SeatID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payment",
                columns: table => new
                {
                    PaymentID = table.Column<Guid>(nullable: false),
                    Amount = table.Column<int>(nullable: false),
                    Status = table.Column<string>(maxLength: 50, nullable: false),
                    CreateAt = table.Column<DateTime>(nullable: false),
                    BookingID = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payment", x => x.PaymentID);
                    table.ForeignKey(
                        name: "FK_Payment_Booking_BookingID",
                        column: x => x.BookingID,
                        principalTable: "Booking",
                        principalColumn: "BookingID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Booking_ShowTimeID",
                table: "Booking",
                column: "ShowTimeID");

            migrationBuilder.CreateIndex(
                name: "IX_Booking_UserID",
                table: "Booking",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_BookingSeat_BookingID",
                table: "BookingSeat",
                column: "BookingID");

            migrationBuilder.CreateIndex(
                name: "IX_BookingSeat_SeatID",
                table: "BookingSeat",
                column: "SeatID");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_BookingID",
                table: "Payment",
                column: "BookingID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SeatHolding_SeatID",
                table: "SeatHolding",
                column: "SeatID");

            migrationBuilder.CreateIndex(
                name: "IX_SeatHolding_ShowTimeID",
                table: "SeatHolding",
                column: "ShowTimeID");

            migrationBuilder.CreateIndex(
                name: "IX_SeatHolding_UserID",
                table: "SeatHolding",
                column: "UserID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookingSeat");

            migrationBuilder.DropTable(
                name: "Payment");

            migrationBuilder.DropTable(
                name: "SeatHolding");

            migrationBuilder.DropTable(
                name: "Booking");
        }
    }
}
