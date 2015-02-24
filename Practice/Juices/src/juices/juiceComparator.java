package juices;

import java.util.Comparator;

public class juiceComparator implements Comparator<Juice>{
    
    @Override
    public int compare(Juice a, Juice b){
        return a.getCount() - b.getCount();
    }
    
}
