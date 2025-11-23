cat > README.md << 'EOF'
# CA Campus Market (MERN)

A campus-scoped marketplace for California universities and high schools.
- Separate feeds per campus
- Post listings with images
- Basic auth and messaging (MVP)

## Monorepo
- `/server` – Node/Express/Mongoose API
- `/client` – React app (Vite), TanStack Query, Tailwind

## Roadmap (MVP)
- [ ] Auth (Google/email link)
- [ ] Campus model + seed
- [ ] Listings CRUD (campus-scoped)
- [ ] Search & filters
- [ ] Message seller
EOF