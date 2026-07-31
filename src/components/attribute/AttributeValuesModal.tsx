import type { Attribute } from '../../features/attribute/attributeApi';

interface Props {
  open: boolean;

  attribute: Attribute | null;

  onClose: () => void;
}

const AttributeValuesModal = ({ open, attribute, onClose }: Props) => {
  if (!open || !attribute) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[700px] rounded bg-white p-6">
        <div className="mb-6 flex justify-between">
          <h2 className="text-2xl font-bold">{attribute.name} Values</h2>

          <button
            onClick={onClose}
            className="cursor-pointer rounded border px-3 py-1"
          >
            Close
          </button>
        </div>

        <button className="mb-4 cursor-pointer rounded bg-blue-600 px-4 py-2 text-white">
          Add Value
        </button>

        <table className="w-full border">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Value</th>

              <th className="p-3 text-left">Slug</th>

              <th className="p-3 text-left">Reference</th>

              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {attribute.values.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.value}</td>

                <td className="p-3">{item.slug}</td>

                <td className="p-3">{item.referenceValue ?? '-'}</td>

                <td className="space-x-2 p-3">
                  <button className="cursor-pointer rounded bg-yellow-500 px-3 py-1 text-white">
                    Edit
                  </button>

                  <button className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttributeValuesModal;
