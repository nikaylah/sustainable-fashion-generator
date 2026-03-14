import { Button, Card, CardBody, Divider } from "@heroui/react";

export default function ResultCard({ result, onGenerateAnother, isLoading }) {
  return (
    <div className="flex h-full w-full flex-col gap-5">
      <Card className="border border-sand/50 bg-white shadow-[0_30px_80px_-50px_rgba(80,70,55,0.45)]">
        <CardBody className="gap-6 p-6 sm:p-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage/80">
              outfit concept
            </p>
            <div>
              <h2 className="font-heading text-3xl text-stone-900">{result.outfitName}</h2>
              <p className="mt-3 text-base leading-7 text-stone-600">
                {result.outfitDescription}
              </p>
            </div>
          </div>

          <Divider className="bg-sand/50" />

          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Recommended Fabrics
            </h3>
            <div className="grid gap-3">
              {result.fabrics.map((fabric) => (
                <div key={fabric.name} className="rounded-2xl bg-cream px-4 py-3">
                  <p className="font-semibold text-stone-900">{fabric.name}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{fabric.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Color Palette
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {result.colorPalette.map((color) => (
                <div
                  key={`${color.name}-${color.hex}`}
                  className="flex items-center gap-3 rounded-2xl border border-sand/40 bg-white px-4 py-3"
                >
                  <span
                    className="h-12 w-12 rounded-2xl border border-white shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="font-semibold text-stone-900">{color.name}</p>
                    <p className="text-sm text-stone-500">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Styling Notes
            </h3>
            <p className="text-base leading-7 text-stone-600">{result.stylingNotes}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Sustainability Insight
            </h3>
            <p className="text-base leading-7 text-stone-600">{result.sustainabilityInsight}</p>
          </section>

          <Button
            radius="full"
            size="lg"
            className="mt-2 bg-sand text-base font-semibold text-stone-900"
            isLoading={isLoading}
            onPress={onGenerateAnother}
          >
            Generate Another
          </Button>
        </CardBody>
      </Card>

      <Card className="border border-sage/20 bg-white/85 shadow-[0_24px_70px_-52px_rgba(124,154,126,0.6)]">
        <CardBody className="gap-3 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage/80">
            ai reasoning
          </p>
          <p className="text-base leading-7 text-stone-600">{result.aiReasoning}</p>
        </CardBody>
      </Card>
    </div>
  );
}
