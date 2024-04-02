# Next.js + Shadcn-ui + Radix Colors

This template is a naked Next.js project with Shadcn-ui and Radix Colors. _Naked_ means that it has no default code or styles, just the basic configuration to get you started.

## Getting Started

To create a new project using this template, run the following command:

```bash
bun create https://github.com/PierreLouisLetoquart/nextjs-shadcn-radixcol <PROJECT_NAME>
```

Then, navigate to the project directory and add the dev command:

```bash
cd <PROJECT_NAME>
nvim package.json
```

Add the following script to the `scripts` object:

```json
"dev": "next dev --turbo"
```

_`--turbo` is optionnal, it enables the turbo mode._

Finally, run the dev command:

```bash
bun run dev
```

## Resources

- [**Next.js** Documentation](https://nextjs.org/docs)
- [**Shadcn-ui** Documentation](https://ui.shadcn.com/docs)
- [**Radix Colors** Documentation](https://www.radix-ui.com/colors)
