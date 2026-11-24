FROM node:22-bookworm-slim@sha256:66cb8ef75184df13dc0dcf866330488996b485d404db60555756865300ced4a5

WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000

COPY src/ ./src/
COPY public/ ./public/

USER node
EXPOSE 3000
CMD ["node", "src/server.mjs"]
