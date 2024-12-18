from backend.domain.line_plot import line_plot_basal, line_plot_bolus, line_plot_glycemia
from backend.domain.utils import extreme_timestamps


def scale(vector: list[float]) -> list[float]:
    return vector


def get_embedding(file_basal: str, file_bolus: str, file_glycemia: str) -> list[float]:
    from_timestamp, to_timestamp = extreme_timestamps(file_basal)
    basal = line_plot_basal(file_basal, from_timestamp, to_timestamp, 60)
    bolus = line_plot_bolus(file_bolus, from_timestamp, to_timestamp, 60)
    glycemia = line_plot_glycemia(file_glycemia, from_timestamp, to_timestamp, 60)

    vector = []
    for data in (basal, bolus, glycemia):
        for datapoint in data:
            vector.append(datapoint.measurements.mean.item())
            vector.append(datapoint.measurements.median.item())
            vector.append(datapoint.measurements.min.item())
            vector.append(datapoint.measurements.max.item())

    return scale(vector)
