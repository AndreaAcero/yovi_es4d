# Use a Rust base image for compilation
FROM rust:latest AS builder

WORKDIR /app/gamey

# Copy Cargo.toml and Cargo.lock
COPY benches ./benches
COPY Cargo.toml Cargo.lock ./
COPY src/ ./src/

# Build the application
RUN cargo build --release

# Use a minimal image for the final stage
FROM debian:bookworm-slim

WORKDIR /app/gamey

# Copy the compiled binary from the builder stage
COPY --from=builder /app/gamey/target/release/gamey .

# Expose the port gamey will listen on
EXPOSE 4000


ARG API_ORIN_URI:="http://localhost:5173"
ENV REACT_APP_API_ORIGIN_ENDPOINT=$API_ORIGIN_URI

# Run the gamey server on port 4000
CMD ["./gamey", "--mode", "server", "--port", "4000"]
