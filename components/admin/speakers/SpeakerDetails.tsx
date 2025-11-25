export default function SpeakerDetails({
  speaker,
}: {
  speaker: {
    name: string;
    photoUrl?: string;
    expertise: string;
    years: number | string;
    industries: string[];
    bio: string;
    trainings: Array<{ id: string; title: string }>;
  };
}) {
  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="flex items-center gap-6">
        {speaker.photoUrl && <img src={speaker.photoUrl} alt={speaker.name} className="w-24 h-24 rounded-full object-cover" />}
        <div>
          <h2 className="text-2xl font-bold">{speaker.name}</h2>
          <div className="text-sm text-muted-foreground">
            Area Of Expertise: <span className="font-medium">{speaker.expertise}</span> <br />
            Years Of Experience: <span className="font-medium">{speaker.years}</span><br />
            Industries: <span className="font-medium">{speaker.industries.join(', ')}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold">Bio</h3>
        <p className="text-muted-foreground">{speaker.bio}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Trainings by {speaker.name}</h3>
        <ul className="pl-4 list-disc">
          {speaker.trainings.map(t => (
            <li key={t.id}>
              <a href={`/admin/trainings/${t.id}`} className="text-blue-600 underline">{t.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
