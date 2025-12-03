import SvgCoordinatePicker from '../components/SvgCoordinatePicker';

export default function SvgTestPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          SVG Coordinate Picker
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Click anywhere on the shape below to get the exact X and Y coordinates relative to the SVG's viewBox (0 0 1680 366).
          </p>
          
          <SvgCoordinatePicker />
        </div>
      </div>
    </div>
  );
}
